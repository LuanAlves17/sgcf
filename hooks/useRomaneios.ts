import { useEffect, useRef, useState } from "react";
import { IRomaneio } from "../interfaces/IRomaneio";
import { throwCustomDialog } from "../components/ui/dialog"; 

export function useTruckList(unidade: string) {
  const [data, setData] = useState<IRomaneio[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!unidade) return;

    const ws = new WebSocket("ws://localhost:4000");
    socketRef.current = ws;

    ws.onopen = () => console.log("🟢 WS conectado");
    ws.onclose = () => console.log("🔴 WS desconectado");

    ws.onmessage = (event) => {
      try {
        const allData: IRomaneio[] = JSON.parse(event.data);
        const filtered = allData.filter((item) => item.unidade === unidade);
        setData(filtered);
        setLoading(false);
      } catch (err) {
        console.error("❌ Erro parseando WS:", err);
      }
    };

    return () => ws.close();
  }, [unidade]);

  const handleSelect = (romaneio: IRomaneio, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(romaneio.nr_romaneio) : next.delete(romaneio.nr_romaneio);
      return next;
    });
  };

  const handleChamarSelecionados = async () => {
    const romaneiosSelecionados = data.filter((r) => selected.has(r.nr_romaneio));
    const placas = romaneiosSelecionados.map((r) => ` ${r.nr_placa_veiculo}`).join(", ");

    await throwCustomDialog({
      type: "confirm",
      title: "Deseja realmente chamar?",
      message: `Placa${romaneiosSelecionados.length > 1 ? "s" : ""}: ${placas}`,
      confirmMessage: "Sim, chamar",
      cancelMessage: "Cancelar",
      onConfirmMessage: "Chamado com sucesso, aguardando primeira pesagem e atualização no EBS.",
      color: "#198c35ff",
    });

    setSelected(new Set());
  };

  return { data, selected, loading, handleSelect, handleChamarSelecionados };
}
