import { IFila } from "./IFila";

export interface IParametro {
  id: number;
  unidade: string;
  segregacao_fila: boolean;
  exibir_fila: boolean;
  filas: IFila[]
}