export interface IDialog {
    type: "success" | "error" | "warning" | "info" | "loading"
    title: string
    message: string
    confirmMessage: string
    color?: string
}