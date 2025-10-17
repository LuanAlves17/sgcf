"use client"

import { useEffect, useState } from "react";
import { api } from "../utils/axios";
import { IRomaneio } from "../interfaces/IRomaneio";
import { IChamado } from "../interfaces/IChamado";

export function useChamadaTV(unidade?: string) {
  const [romaneios, setRomaneios] = useState<IRomaneio[]>([]);
  const [chamadosDetalhes, setChamadosDetalhes] = useState<IChamado[]>([]);
  const [ultimosChamados, setUltimosChamados] = useState<IChamado[]>([]);

  useEffect(() => {
    if (!unidade) return;
    (async () => {
      try {
        const [{ data: esperando }, { data: chamados }] = await Promise.all([
          api.get(`/caminhoes-esperando/${unidade}`),
          api.get(`/caminhoes-chamados/${unidade}`),
        ]);

        const chamadosSet = new Set(chamados.map((r: any) => r.nr_romaneio));
        setRomaneios(esperando.filter((r: any) => !chamadosSet.has(r.nr_romaneio)));

        setChamadosDetalhes(chamados);
        setUltimosChamados(
          [...chamados].sort((a, b) =>
            new Date(b.data_chamado).getTime() - new Date(a.data_chamado).getTime()
          ).slice(0, 3)
        );
      } catch (err) {
        console.error("Erro ao buscar romaneios:", err);
      }
    })();
  }, [unidade]);

  useEffect(() => {
    if (!unidade) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/caminhoes-chamados/${unidade}`);
        setChamadosDetalhes(data);
        setUltimosChamados(
          [...data].sort((a, b) =>
            new Date(b.data_chamado).getTime() - new Date(a.data_chamado).getTime()
          ).slice(0, 3)
        );
      } catch (err) {
        console.error("Erro ao sincronizar chamados:", err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [unidade]);

  return { romaneios, chamadosDetalhes, ultimosChamados, setRomaneios, setChamadosDetalhes, setUltimosChamados };
}
