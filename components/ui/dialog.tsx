import Swal, { SweetAlertIcon } from "sweetalert2";
import { colors } from "../../constants/colors";
import { IDialog } from "../../interfaces/IDialog";

export function throwCustomDialog(dialog: IDialog) {
  const { type, title, message, confirmMessage, color } = dialog;

  const baseConfig = {
    title: `<span style="font-family: Poppins, sans-serif;">${title}</span>`,
    html: `<span style="font-family: Poppins, sans-serif;">${message}</span>`,
    confirmButtonText: confirmMessage || "OK",
    confirmButtonColor: color || colors.first,
    allowOutsideClick: false,
    allowEscapeKey: false,
  };

  switch (type) {
    case "loading":
      Swal.fire({
        ...baseConfig,
        title: `<span style="font-family: Poppins, sans-serif;">${title || "Carregando..."}</span>`,
        html: `<div style="display:flex;justify-content:center;align-items:center;flex-direction:column;gap:10px;">
                 <span style="font-family: Poppins, sans-serif;">${message || "Aguarde um instante"}</span>
               </div>
               `,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      break;

    case "success":
      Swal.fire({
        ...baseConfig,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });
      break;

    case "warning":
      Swal.fire({
        ...baseConfig,
        icon: "warning",
      });
      break;

    case "error":
      Swal.fire({
        ...baseConfig,
        icon: "error",
      });
      break;

    default:
      Swal.fire({
        ...baseConfig,
        icon: (type as SweetAlertIcon) || "info",
      });
      break;
  }
}
