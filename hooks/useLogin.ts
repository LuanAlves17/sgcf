import { useState, FormEvent } from "react";
import { signIn, signOut } from "next-auth/react";
import { throwCustomDialog } from "../components/ui/dialog";
import { colors } from "../constants/colors";
import { clearStorage } from "../functions/storage/clearLocalStorage";

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

  async function logout() {
    clearStorage();

    await signOut({ callbackUrl: "/login" });
  }

  return { loading, handleSubmit, logout };
}
