import { useEffect, useState } from "react";
import { IFila } from "../interfaces/IFila";
import { IRomaneio } from "../interfaces/IRomaneio"; 


export function useFilas(parametro: any, filas: IFila[] | undefined, romaneios: IRomaneio[]) {
    const [tipoFilas, setTipoFilas] = useState<IFila[]>([]);
    const [filaAtiva, setFilaAtiva] = useState<string | null>(null);


    useEffect(() => {
        if (!parametro) return;


        if (parametro.segregacao_fila && filas && filas.length > 0) {
            setTipoFilas(filas);


            if (!filaAtiva && filas.length > 0) setFilaAtiva(filas[0].nome_fila);
                return;
        }


        const filasAutom = Array.from(new Set(romaneios.map((r) => r.tipo_romaneio))).filter(Boolean).map((tipo, i) => ({ id: i, nome_fila: tipo, parametro_id: -1 }));


        setTipoFilas(filasAutom as IFila[]);
        if (!filaAtiva && filasAutom.length > 0) setFilaAtiva((filasAutom[0] as any).nome_fila);
    }, [parametro, filas, romaneios, filaAtiva]);


    return { tipoFilas, filaAtiva, setFilaAtiva };
}