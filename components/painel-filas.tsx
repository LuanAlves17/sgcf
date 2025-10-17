import React from "react";
import { Grid, Typography } from "@mui/material";
import { IFila } from "../interfaces/IFila";
import { IRomaneio } from "../interfaces/IRomaneio";
import { colors } from "../constants/colors";


function RomaneioRow({ caminhao }: { caminhao: any }) {
    return (
        <Grid container p={2} borderBottom={1}>
            <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>{caminhao.nr_romaneio}</Typography></Grid>
            <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center" textAlign="center"><Typography noWrap>{caminhao.nm_motorista || caminhao.nome_motorista || ""}</Typography></Grid>
            <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>{caminhao.nr_placa_veiculo || caminhao.placa}</Typography></Grid>
            <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center" textAlign="center"><Typography>{caminhao.cultura}</Typography></Grid>
        </Grid>
    );
}


export default function PainelFilas({ parametro, romaneios, tipoFilas, filaAtiva }: { parametro: any; romaneios: IRomaneio[]; tipoFilas: IFila[]; filaAtiva: string | null }) {
    const semFila = romaneios.filter(r => {
    if (!parametro?.segregacao_fila) return false;
    if (!r.tipo_romaneio) return true;
    return !tipoFilas.some(f => f.nome_fila === r.tipo_romaneio);
    });


    const romaneiosFilaAtiva = romaneios.filter(r => {
    if (!filaAtiva) return false;
    if (!parametro?.segregacao_fila) return r.tipo_romaneio === filaAtiva;
    return  r.tipo_romaneio === filaAtiva;
    });


    return (
        <Grid size={{ xs: 8, md: 8 }} sx={{ borderLeft: `2px solid ${colors.white}`, height: "100vh", overflowY: "scroll" }}>
            {romaneiosFilaAtiva.length > 0 && (
            <Grid>
                <Typography variant="h5" align="center" sx={{ p: 2, background: colors.first, color: "white" }}>
                    {filaAtiva}
                </Typography>


                <Grid container p={2} textTransform="uppercase" sx={{ background: colors.second, color: "white" }}>
                    <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>ROMANEIO</Typography></Grid>
                    <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>MOTORISTA</Typography></Grid>
                    <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>PLACA</Typography></Grid>
                    <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>CULTURA</Typography></Grid>
                </Grid>


                {romaneiosFilaAtiva.map((caminhao, idx) => <RomaneioRow key={idx} caminhao={caminhao} /> )}
            </Grid>
            )}


            {semFila.length > 0 && (
            <Grid>
                <Typography variant="h5" align="center" sx={{ p: 2, background: colors.first, color: "white" }}>
                Caminhões Aguardando / Sem Fila definida
                </Typography>


                <Grid container p={2} textTransform="uppercase" sx={{ background: colors.second, color: "white" }}>
                    <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>ROMANEIO</Typography></Grid>
                    <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>MOTORISTA</Typography></Grid>
                    <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>PLACA</Typography></Grid>
                    <Grid size={{ xs: 3, md: 3 }} display="flex" justifyContent="center"><Typography>CULTURA</Typography></Grid>
                </Grid>


                {semFila.map((caminhao, idx) => <RomaneioRow key={idx} caminhao={caminhao} />)}
            </Grid>
            )}
        </Grid>
    );
}