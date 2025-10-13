export interface IDialog {
    type: "success" | "error" | "warning" | "info" | "loading" | "confirm"
    title: string
    message: string
    confirmMessage: string
    cancelMessage?: string
    color?: string
    onConfirmMessage?: string
}