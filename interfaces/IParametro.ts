export interface IParametro {
  id: number;
  unidade: string;
  segregacao_fila: boolean;
  exibir_fila: boolean;
  filas: IFila[]
}

export interface IFila {
  id: number;
  nome_fila: string;
}