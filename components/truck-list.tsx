"use client";

import { Grid, CircularProgress } from "@mui/material";
import TruckListHeader from "./ui/truck-list-header";
import RomaneioCard from "./ui/romaneio";
import { useTruckList } from "../hooks/useRomaneios";
import { memo } from "react";

interface TruckListProps { unidade: string }

function TruckListComponent({ unidade }: TruckListProps) {
  const { data, selected, handleSelect, handleChamarSelecionados, loading } = useTruckList(unidade);

  return (
    <Grid container spacing={3} sx={{ maxWidth: 1200, mx: "auto", my: 3, p: 2, border: "1px solid #dadada", borderRadius: 2, flexDirection: "column" }}>
      <TruckListHeader total={data.length} selectedCount={selected.size} onChamarSelecionados={handleChamarSelecionados} />

      <Grid display="flex" flexDirection="column" gap={1}>
        {loading ? <CircularProgress color="success" /> : data.map((r, id) => (
          <RomaneioCard key={id} romaneio={r} selected={selected.has(r.nr_romaneio)} onSelect={handleSelect} />
        ))}
      </Grid>
    </Grid>
  );
}

export default memo(TruckListComponent);
