"use client";

import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import Header from "../../../../../components/header";
import { useParametros } from "../../../../../hooks/useParametros";
import ParametrosForm from "../../../../../components/forms/parametros-form";
import { useUnidade } from "../../../../../hooks/useUnidade";

export default function Parametros() {
  const { unidade, loading: loadingUnidade } = useUnidade();

  const {
    parametro,
    setParametro,
    filas,
    novaFila,
    setNovaFila,
    addFila,
    removeFila,
    saveParametros,
    loading: loadingParametros,
  } = useParametros(unidade);

  if (loadingUnidade || loadingParametros) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!parametro) {
    return (
      <>
        <Header/>
        <Box sx={{ p: 3 }}>
          <Typography>Parâmetros não encontrados.</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header />

      <Box sx={{ p: 3, backgroundColor: "#fafafa", minHeight: "100vh" }}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            maxWidth: 1200,
            mx: "auto",
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" color="success" sx={{ mb: 2 }}>
            Gerenciamento de Fila
          </Typography>

          <ParametrosForm
            parametro={parametro}
            setParametro={setParametro}
            filas={filas}
            novaFila={novaFila}
            setNovaFila={setNovaFila}
            onAddFila={addFila}
            onRemoveFila={removeFila}
            onSave={saveParametros}
          />
        </Paper>
      </Box>
    </>
  );
}
