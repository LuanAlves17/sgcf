"use client"

import { useEffect, useState, useCallback } from "react";
import { getSession } from "next-auth/react";
import { extractUnidadeFromDn } from "../functions/auth/extractUnidade";
import { normalizeUnidade } from "../functions/auth/normalizeUnidade";

export function useUnidade() {
  const [unidade, setUnidade] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnidade = useCallback(async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (!session?.user?.dn) throw new Error("Sessão inválida ou sem DN do AD.");

      const unidadeExtraida = extractUnidadeFromDn(session.user.dn);
      const unidadeNormalizada = normalizeUnidade(unidadeExtraida);

      if (!unidadeNormalizada) throw new Error("Unidade não pôde ser identificada.");
      setUnidade(unidadeNormalizada);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao buscar unidade do usuário.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnidade();
  }, [fetchUnidade]);

  return { unidade, loading, error };
}
