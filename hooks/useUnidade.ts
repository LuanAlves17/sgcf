import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { extractUnidadeFromDn } from "../functions/auth/extractUnidade";
import { normalizeUnidade } from "../functions/auth/normalizeUnidade";

interface UseUnidadeReturn {
  unidade: string;
  loading: boolean;
  error: string | null;
}

export function useUnidade(): UseUnidadeReturn {
  const [unidade, setUnidade] = useState<string >('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();

        if (!session?.user || !("dn" in session.user)) {
          setError("Sessão inválida ou sem DN do AD.");
          return;
        }

        const dn = (session.user as any).dn || "";
        const unidadeExtraida = extractUnidadeFromDn(dn);
        const unidadeNormalizada = normalizeUnidade(unidadeExtraida);

        if (!unidadeNormalizada) {
          setError("Unidade não pôde ser identificada.");
          return;
        }

        setUnidade(unidadeNormalizada);
      } catch (err) {
        console.error("Erro ao buscar unidade:", err);
        setError("Erro ao buscar unidade do usuário.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { unidade, loading, error };
}
