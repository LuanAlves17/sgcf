"use client"

import Swal, { SweetAlertIcon } from "sweetalert2";
import { colors } from "../../constants/colors";
import { IDialog } from "../../interfaces/IDialog";

export function throwCustomDialog(dialog: IDialog) {
  const {
    type,
    title,
    message,
    confirmMessage,
    cancelMessage,
    color,
    onConfirmMessage
  } = dialog;

  const baseConfig = {
    title: `${title}`,
    html: `${message}`,
    confirmButtonColor: color || colors.first,
    allowOutsideClick: false,
    allowEscapeKey: false,
  };

  switch (type) {
    case "loading":
      Swal.fire({
        ...baseConfig,
        title: `${title || "Carregando..."}`,
        html: `<div style="display:flex;justify-content:center;align-items:center;flex-direction:column;gap:10px;">
                 ${message || "Aguarde um instante"}
               </div>`,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      break;

    case "success":
      Swal.fire({
        ...baseConfig,
        icon: "success",
        confirmButtonText: confirmMessage || "OK",
        timer: 2000,
        timerProgressBar: true,
      });
      break;

    case "warning":
      Swal.fire({
        ...baseConfig,
        icon: "warning",
        confirmButtonText: confirmMessage || "OK",
      });
      break;

    case "error":
      Swal.fire({
        ...baseConfig,
        icon: "error",
        confirmButtonText: confirmMessage || "OK",
      });
      break;

    case "confirm":
      return Swal.fire({
        ...baseConfig,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: confirmMessage || "Sim",
        cancelButtonText: cancelMessage || "Cancelar",
        cancelButtonColor: "#aaa",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Sucesso',
            html: onConfirmMessage,
            icon: "success",
            confirmButtonColor: colors.first
          })
        }

        return result;
      })

    default:
      Swal.fire({
        ...baseConfig,
        icon: (type as SweetAlertIcon) || "info",
        confirmButtonText: confirmMessage || "OK",
      });
      break;
  }
}
