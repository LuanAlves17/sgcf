"use client";

import Swal, { SweetAlertIcon } from "sweetalert2";
import { colors } from "../../constants/colors";
import { IDialog } from "../../interfaces/IDialog";

export async function throwCustomDialog(dialog: IDialog): Promise<any> {
  const {
    type,
    title,
    message,
    confirmMessage,
    cancelMessage,
    color,
    inputOptions
  } = dialog;

  const baseConfig = {
    title: title || "",
    html: message || "",
    confirmButtonColor: color || colors.first,
    allowOutsideClick: false,
    allowEscapeKey: false,
  };

  switch (type) {
    case "loading":
      Swal.fire({
        ...baseConfig,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      return;

    case "success":
      await Swal.fire({
        ...baseConfig,
        icon: "success",
        confirmButtonText: confirmMessage || "OK",
        timer: 2000,
        timerProgressBar: true,
      });
      return;

    case "warning":
      await Swal.fire({
        ...baseConfig,
        icon: "warning",
        confirmButtonText: confirmMessage || "OK",
      });
      return;

    case "error":
      await Swal.fire({
        ...baseConfig,
        icon: "error",
        confirmButtonText: confirmMessage || "OK",
      });
      return;

    case "confirm":
      const result = await Swal.fire({
        ...baseConfig,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: confirmMessage || "Sim",
        cancelButtonText: cancelMessage || "Cancelar",
        cancelButtonColor: "#aaa",
        reverseButtons: true,
        input: inputOptions ? "select" : undefined,
        inputOptions: inputOptions || undefined,
        inputPlaceholder: inputOptions ? "Selecione..." : undefined,
        didOpen: () => {
            const input = Swal.getInput();
            const confirmButton = Swal.getConfirmButton();

            if (input && confirmButton) {
              confirmButton.disabled = !input.value;
              input.addEventListener("change", () => {
                confirmButton.disabled = !input.value;
              });
            }
  
          },
      });

      return { value: result.value, isConfirmed: result.isConfirmed };
    default:
      await Swal.fire({
        ...baseConfig,
        icon: (type as SweetAlertIcon) || "info",
        confirmButtonText: confirmMessage || "OK",
      });
      return;
  }
}
