"use client";

import Header from "../../../../components/header";
import { CircularProgress, Grid } from "@mui/material";
import { useUnidade } from "../../../../hooks/useUnidade";
import TruckList from "../../../../components/truck-list";

export default function Dashboard() {
  const { unidade } = useUnidade();

  const unidadefake = "007-AEROPORTO"

  return (
    <>
      <Header />

      <TruckList unidade={unidadefake} />
    </>
  );
}
