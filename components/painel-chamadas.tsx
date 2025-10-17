import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { IChamado } from "../interfaces/IChamado";
import { colors } from "../constants/colors";

export default function PainelChamados({ chamadosAgora, ultimosChamados }: { chamadosAgora: IChamado[]; ultimosChamados: IChamado[] }) {
    return (
    <Grid size={{ xs: 4, md: 4 }} sx={{ background: chamadosAgora.length > 0 ? "rgba(170, 13, 13, 1)" : colors.first, height: "100vh", p: 4, color: "white", overflowY: 'scroll'}}>
        <Typography variant="h5" align="center" mb={2}>
            {chamadosAgora.length > 0 ? "CHAMANDO CAMINHÕES" : "ÚLTIMOS CHAMADOS"}
        </Typography>


        {chamadosAgora.length > 0 ? (
            <Box textAlign="center">
                {chamadosAgora.map((chamado, idx) => (
                <Box key={idx} mb={2} sx={{ borderBottom: idx < chamadosAgora.length - 1 ? "1px solid white" : "none", pb: 1 }}>
                    <Typography variant="h4" fontWeight={700}>{chamado.placa}</Typography>
                    <Typography variant="h6">Motorista: {chamado.nome_motorista}</Typography>
                    <Typography variant="h6">Fila: {chamado.fila || "Sem fila"}</Typography>
                    <Typography variant="h6">{new Date(chamado.data_chamado).toLocaleTimeString()}</Typography>
                </Box>
                ))}
                </Box>
                ) : ultimosChamados.length > 0 ? (
                ultimosChamados.map((chamadoRomaneio, index) => (
                <Box key={index} textAlign="center" mb={2} sx={{ borderBottom: "1px solid white", pb: 1 }}>
                    <Typography variant="h4" fontWeight={700}>{chamadoRomaneio.nr_romaneio}</Typography>
                    <Typography variant="h6">Motorista: {chamadoRomaneio.nome_motorista}</Typography>
                    <Typography variant="h6">Fila: {chamadoRomaneio.fila || "Sem fila"}</Typography>
                    <Typography variant="h6">{new Date(chamadoRomaneio.data_chamado).toLocaleTimeString()}</Typography>
                </Box>
            ))
            ) : (
            <Typography align="center">Nenhum chamado ainda.</Typography>
        )}
    </Grid>
    );
}