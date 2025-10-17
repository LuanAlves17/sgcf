import { useEffect, useRef, useState } from "react";
import { IChamado } from "../interfaces/IChamado";
import { IFila } from "../interfaces/IFila";
import { api } from "../utils/axios";

type Args = {
  unidade?: string;
  tipoFilas: IFila[];
  setRomaneios: (r: any) => void;
  setChamadosDetalhes: (c: any) => void;
  setUltimosChamados: (u: any) => void;
  setFilaAtiva: (f: string | null) => void;
};

export function useWebSocketTV({ unidade, tipoFilas, setRomaneios, setChamadosDetalhes, setUltimosChamados, setFilaAtiva }: Args) {
  const [chamadosAgora, setChamadosAgora] = useState<IChamado[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!unidade) return;

    const url = process.env.NEXT_PUBLIC_WEBSOCKET || "";
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log("[TV] WS conectado");
    ws.onclose = () => console.log("[TV] WS desconectado");

    ws.onmessage = async (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "chamada" && Array.isArray(parsed.romaneios)) {
          const novosChamados: IChamado[] = parsed.romaneios.map((r: any) => ({
            ...r,
            fila: r.fila || r.tipo_romaneio || null,
            data_chamado: r.data_chamado ? new Date(r.data_chamado) : new Date(),
          }));

          setRomaneios((prev: any[]) =>
            prev.filter((r) => !novosChamados.some((nc) => nc.nr_romaneio.toString() === r.nr_romaneio.toString()))
          );

          setChamadosAgora(novosChamados);
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
          timeoutRef.current = window.setTimeout(() => setChamadosAgora([]), 5000);

          const filaValida = novosChamados
            .map((c) => c.fila)
            .find((f) => f && tipoFilas.some((tf) => tf.nome_fila === f));
          if (filaValida) setFilaAtiva(filaValida as string);

          try {
            const { data: atualizados } = await api.get(`/caminhoes-chamados/${unidade}`);
            setChamadosDetalhes(atualizados);
            setUltimosChamados(
              [...atualizados]
                .sort((a: any, b: any) => new Date(b.data_chamado).getTime() - new Date(a.data_chamado).getTime())
                .slice(0, 3)
            );
          } catch (err) {
            console.error("Erro ao sincronizar após WS:", err);
          }
        }
      } catch (err) {
        console.error("Erro parseando WS:", err);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [unidade, tipoFilas, setRomaneios, setChamadosDetalhes, setUltimosChamados, setFilaAtiva]);

  return { chamadosAgora };
}
