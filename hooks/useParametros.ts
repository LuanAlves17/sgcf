import { useState, useEffect } from "react";
import { api } from "../utils/axios";
import { throwCustomDialog } from "../components/ui/dialog";
import { IFila, IParametro } from "../interfaces/IParametro";

export function useParametros(unidade?: string | null) {
  const [parametro, setParametro] = useState<IParametro | null>(null);
  const [filas, setFilas] = useState<IFila[]>([]);
  const [novaFila, setNovaFila] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!unidade) {
      setParametro(null);
      setFilas([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        console.log("🟢 Carregando parâmetros para unidade:", unidade);

        const res = await api.get(`/parametros/${unidade}`);
        if (!mounted) return;

        const data = Array.isArray(res.data) ? res.data : [res.data];

        if (data.length > 0 && data[0]) {
          const p = data[0];
          setParametro(p);
          setFilas(p.filas || []);
          console.log("✅ Parâmetro existente carregado:", p);
        } else {
          console.log("⚪ Nenhum parâmetro encontrado, criando novo...");
          const novo = await api.post("/parametros", { unidade });
          if (!mounted) return;

          // garante que o back realmente criou
          const refresh = await api.get(`/parametros/${unidade}`);
          const createdData = Array.isArray(refresh.data)
            ? refresh.data[0]
            : refresh.data;

          if (!createdData) {
            console.error("❌ Erro: o backend não retornou parâmetro após criação.");
            return;
          }

          setParametro(createdData);
          setFilas(createdData.filas || []);
          console.log("✅ Parâmetro criado:", createdData);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar/criar parâmetros:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [unidade]);

  async function addFila() {
    if (!novaFila.trim() || !parametro) return;
    try {
      const { data } = await api.post(`/parametros/${parametro.id}/filas`, {
        nome_fila: novaFila.trim(),
      });
      setFilas((prev) => [...prev, data]);
      setNovaFila("");
    } catch (err) {
      console.error("Erro ao adicionar fila:", err);
    }
  }

  async function removeFila(id: number) {
    try {
      const confirm = await throwCustomDialog({
        type: "confirm",
        title: "Remover fila?",
        message: "Verifique se não há caminhões associados a essa fila.",
        confirmMessage: "Deletar",
        color: "red",
        onConfirmMessage: "Fila removida!",
      });

      if (confirm?.isConfirmed) {
        await api.delete(`/parametros/filas/${id}`);
        setFilas((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error("Erro ao remover fila:", err);
    }
  }

  async function saveParametros() {
    if (!parametro) return;
    try {
      if (novaFila.trim()) await addFila();

      await api.patch(`/parametros/${parametro.id}`, {
        segregacao_fila: parametro.segregacao_fila,
        exibir_fila: parametro.exibir_fila,
      });

      throwCustomDialog({
        type: "success",
        title: "Sucesso!",
        message: "Parâmetros salvos com sucesso!",
        confirmMessage: "Ok",
      });
    } catch (err) {
      console.error("Erro ao salvar parâmetros:", err);
    }
  }

  return {
    parametro,
    setParametro,
    filas,
    setFilas,
    novaFila,
    setNovaFila,
    addFila,
    removeFila,
    saveParametros,
    loading,
  };
}
