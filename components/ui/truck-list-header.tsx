"use client"

import { Button, Grid, Typography } from "@mui/material";

interface Props {
  total: number;
  selectedCount: number;
  onChamarSelecionados: () => void;
}

export default function TruckListHeader({ total, selectedCount, onChamarSelecionados }: Props) {
  return (
    <Grid display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" color="success.main">
        Caminhões na Fila ({total})
      </Typography>

      <Button
        variant="contained"
        color="success"
        onClick={onChamarSelecionados}
        disabled={selectedCount === 0}
        size="small"
        sx={{ textTransform: "none", fontWeight: 600, px: 2.5, py: 0.6, minWidth: 100 }}
      >
        Chamar Selecionados ({selectedCount})
      </Button>
    </Grid>
  );
}
