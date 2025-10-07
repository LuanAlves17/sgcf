"use client";

import { useState, FormEvent } from "react";
import { signIn, getSession } from "next-auth/react";
import { throwCustomDialog } from "../components/ui/dialog";
import { putStorage } from "../functions/storage/putLocalStorage";
import { extractUnidadeFromDn } from "../functions/auth/extractUnidade";
import { normalizeUnidade } from "../functions/auth/normalizeUnidade"; 
import { colors } from "../constants/colors";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);

    const form = new FormData(event.currentTarget);
    const username = form.get("username") as string;
    const password = form.get("senha") as string;

    try {
      const response = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (response?.error) {
        showLoginError();
        return;
      }

      await handleSuccessfulLogin();
    } catch {
      showServerError();
    } finally {
      setLoading(false);
    }
  }

  async function handleSuccessfulLogin() {
    const session = await getSession();
    const dn = (session?.user && "dn" in session.user && session.user.dn) || "";
    const unidade = normalizeUnidade(extractUnidadeFromDn(dn));

    putStorage("unidade", unidade);
    window.location.replace("/dashboard/");
  }

  function showLoginError() {
    throwCustomDialog({
      title: "Erro",
      message: "Usuário ou senha inválidos",
      type: "error",
      confirmMessage: "OK!",
      color: colors.first,
    });
  }

  function showServerError() {
    throwCustomDialog({
      title: "Erro interno",
      message: "Falha ao conectar ao servidor",
      type: "error",
      confirmMessage: "OK!",
      color: colors.first,
    });
  }

  return { loading, handleSubmit };
}
