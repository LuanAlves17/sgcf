"use client"

import { useEffect, useState, useCallback } from "react";
import { api } from "../utils/axios";
import { throwCustomDialog } from "../components/ui/dialog";
import type { IParametro } from "../interfaces/IParametro";
import { IFila } from "../interfaces/IFila";

export function useParametros(unidade?: string | null) {
  const [parametro, setParametro] = useState<IParametro | null>(null);
  const [filas, setFilas] = useState<IFila[]>([]);
  const [novaFila, setNovaFila] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchParametros = useCallback(async () => {
    if (!unidade) return setLoading(false);
    setLoading(true);

    try {
      const res = await api.get(`/parametros/${unidade}`);
      const data = Array.isArray(res.data) ? res.data[0] : res.data;

      if (data) {
        setParametro(data);
        setFilas(data.filas || []);
      } else {
        const created = await api.post("/parametros", { unidade });
        const refresh = await api.get(`/parametros/${unidade}`);
        const createdData = Array.isArray(refresh.data) ? refresh.data[0] : refresh.data;
        setParametro(createdData);
        setFilas(createdData.filas || []);
      }
    } catch (err) {
      console.error("Erro ao carregar parâmetros:", err);
    } finally {
      setLoading(false);
    }
  }, [unidade]);

  useEffect(() => {
    fetchParametros();
  }, [fetchParametros]);

  const addFila = useCallback(async () => {
    if (!novaFila.trim() || !parametro) return;
    const { data } = await api.post(`/parametros/${parametro.id}/filas`, { nome_fila: novaFila.trim() });
    setFilas((prev) => [...prev, data]);
    setNovaFila("");
  }, [novaFila, parametro]);

  const removeFila = useCallback(async (id: number) => {
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
  }, []);

  const saveParametros = useCallback(async () => {
    if (!parametro) return;
    if (novaFila.trim()) await addFila();

    await api.patch(`/parametros/${parametro.id}`, {
      segregacao_fila: parametro.segregacao_fila,
      exibir_fila: parametro.exibir_fila,
    });

    await throwCustomDialog({ type: "success", title: "Sucesso!", message: "Parâmetros salvos com sucesso!", confirmMessage: "Ok" });
  }, [novaFila, parametro, addFila]);

  return { parametro, setParametro, filas, setFilas, novaFila, setNovaFila, addFila, removeFila, saveParametros, loading };
}
