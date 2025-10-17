import { IChamado } from "../../interfaces/IChamado";

export function sortUltimosChamados(chamados: IChamado[], limit = 3) {
    return [...chamados].sort((a: IChamado, b: IChamado) => new Date(b.data_chamado).getTime() - new Date(a.data_chamado).getTime()).slice(0, limit);
}