"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { api } from "../utils/axios";
import { throwCustomDialog } from "../components/ui/dialog";
import { IRomaneio } from "../interfaces/IRomaneio"; 
import { IParametro } from "../interfaces/IParametro";
import { IFila } from "../interfaces/IFila";

export function useTruckList(unidade: string) {
  const [data, setData] = useState<IRomaneio[]>([]);
  const [chamadosIds, setChamadosIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);
  const pathname = usePathname();

  const filterNaoChamados = (romaneios: IRomaneio[], chamados: Set<string>) =>
    romaneios.filter(r => !chamados.has(String(r.nr_romaneio)));

  const groupByTipoRomaneio = (romaneios: IRomaneio[]) =>
    romaneios.reduce<Record<string, IRomaneio[]>>((acc, r) => {
      if (!acc[r.tipo_romaneio]) acc[r.tipo_romaneio] = [];
      acc[r.tipo_romaneio].push(r);
      return acc;
    }, {});

  const buildConfirmText = (grupos: Record<string, IRomaneio[]>) =>
    Object.entries(grupos)
      .map(([tipo, rs]) => `<b>${tipo}</b>: ${rs.map(r => r.nr_placa_veiculo).join(", ")}`)
      .join("<br/>");

  useEffect(() => {
    if (!unidade) return;

    const fetchInitial = async () => {
      setLoading(true);
      try {
        const [{ data: esperando }, { data: chamados }] = await Promise.all([
          api.get(`/caminhoes-esperando/${unidade}`),
          api.get(`/caminhoes-chamados/${unidade}`)
        ]);

        const chamadosSet = new Set(chamados.map((r: any) => String(r.nr_romaneio)));
        setChamadosIds(chamadosSet);

        setData(filterNaoChamados(esperando, chamadosSet));
      } catch (err) {
        console.error("Erro ao buscar romaneios iniciais:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [unidade]);

  // -------------------- WebSocket --------------------
  useEffect(() => {
    if (!unidade) return;

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET || "");
    socketRef.current = ws;

    ws.onopen = () => console.log("WS conectado");
    ws.onclose = () => console.log("WS desconectado");

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "chamada") {
          const novosRomaneios: IRomaneio[] = parsed.romaneios || [];
          const novosIds = new Set(novosRomaneios.map(r => String(r.nr_romaneio)));

          setChamadosIds(prev => new Set([...Array.from(prev), ...Array.from(novosIds)]));
          setData(prev => prev.filter(r => !novosIds.has(String(r.nr_romaneio))));
          return;
        }

        const allData = Array.isArray(parsed) ? parsed : [parsed];
        const unidadeData = allData.filter(d => d.unidade === unidade);

        setData(prev => {
          const mapPrev = new Map(prev.map(r => [String(r.nr_romaneio), r]));
          unidadeData.forEach((r: any) => mapPrev.set(String(r.nr_romaneio), r));

          return Array.from(mapPrev.values()).filter(r => !chamadosIds.has(String(r.nr_romaneio)));
        });

      } catch (err) {
        console.error("Erro parseando WS:", err);
      }
    };

    return () => {
      try { ws.close(); } catch (e) {}
      socketRef.current = null;
    };
  }, [unidade, pathname, chamadosIds]);

  // -------------------- Seleção --------------------
  const handleSelect = useCallback((romaneio: IRomaneio, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      checked ? next.add(romaneio.nr_romaneio) : next.delete(romaneio.nr_romaneio);
      return next;
    });
  }, []);

  // -------------------- Dialogs --------------------
  const confirmAction = async (title: string, message: string) => {
    const result = await throwCustomDialog({
      type: "confirm",
      title,
      message,
      confirmMessage: "Sim, chamar",
      cancelMessage: "Cancelar",
    });
    return result.isConfirmed;
  };

  const selectFila = async (placas: string, filas: IFila[]) => {
    const options = Object.fromEntries(filas.map(f => [f.id, f.nome_fila]));
    const result = await throwCustomDialog({
      type: "confirm",
      title: "Escolha uma fila",
      message: `Placas: ${placas}`,
      inputOptions: options,
      confirmMessage: "Continuar",
      cancelMessage: "Cancelar",
    });
    return filas.find(f => f.id === Number(result.value))?.nome_fila;
  };

  // -------------------- Chamar Selecionados --------------------
  const handleChamarSelecionados = useCallback(async () => {
    const romaneiosSelecionados = data.filter(r => selected.has(r.nr_romaneio));
    if (!romaneiosSelecionados.length) return;

    const parametros: IParametro = (await api.get(`/parametros/${unidade}`)).data[0];
    const placas = romaneiosSelecionados.map(r => r.nr_placa_veiculo).join(", ");

    let chamadas: { fila: string | null; romaneios: IRomaneio[] }[] = [];

    if (parametros?.segregacao_fila && parametros.filas.length) {
      const filaNome = await selectFila(placas, parametros.filas);
      if (!filaNome) return;

      const confirmed = await confirmAction(
        "Deseja realmente chamar?",
        `<b>Placas</b>: ${placas}<br/><b>Fila</b>: ${filaNome}`
      );
      if (!confirmed) return;

      chamadas.push({ fila: filaNome, romaneios: romaneiosSelecionados });
    } else {
      const grupos = groupByTipoRomaneio(romaneiosSelecionados);
      const confirmText = buildConfirmText(grupos);

      const confirmed = await confirmAction(
        "Deseja realmente chamar?",
        `As seguintes filas serão chamadas:<br/>${confirmText}`
      );
      if (!confirmed) return;

      chamadas = Object.entries(grupos).map(([tipo, rs]) => ({ fila: tipo, romaneios: rs }));
    }

    for (const chamada of chamadas) {
      await api.post("/chamada", {
        unidade,
        fila: chamada.fila,
        romaneios: chamada.romaneios.map(r => ({
          nr_romaneio: r.nr_romaneio,
          placa: r.nr_placa_veiculo,
          nome_motorista: r.nm_motorista,
        }))
      });
    }

    await throwCustomDialog({
      type: "success",
      title: "Operação concluída com sucesso",
      message: "Chamados enviados com sucesso.",
    });

    setSelected(new Set());
  }, [data, selected, unidade]);

  return { data, selected, loading, handleSelect, handleChamarSelecionados };
}
