"use client"

import React from "react";


import { useChamadaTV } from "../../../../../hooks/useChamadaTV";
import { useWebSocketTV } from "../../../../../hooks/useWebSocket";
import { useFilas } from "../../../../../hooks/useFilas";
import { HeaderTV } from "../../../../../components/ui/header-tv";
import PainelChamados from "../../../../../components/painel-chamadas";
import PainelFilas from "../../../../../components/painel-filas";
import { Grid } from "@mui/material";
import { useParametros } from "../../../../../hooks/useParametros";
import { useParams } from "next/navigation";


export default function TVDisplay() {
  const { unidade } = useParams();
  const { parametro, filas } = useParametros(unidade);


  const {
  romaneios,
  chamadosDetalhes,
  ultimosChamados,
  setRomaneios,
  setChamadosDetalhes,
  setUltimosChamados,
  } = useChamadaTV(unidade as string | undefined);


  const { tipoFilas, filaAtiva, setFilaAtiva } = useFilas(parametro, filas, romaneios);


  const { chamadosAgora } = useWebSocketTV({
  unidade: unidade as string | undefined,
  tipoFilas,
  setRomaneios,
  setChamadosDetalhes,
  setUltimosChamados,
  setFilaAtiva,
  });


  return (
  <Grid>
    <HeaderTV unidade={unidade as string | undefined} />

    <Grid container sx={{ borderTop: "2px solid #fff" }}>
      <PainelChamados chamadosAgora={chamadosAgora} ultimosChamados={ultimosChamados} />


      <PainelFilas
      parametro={parametro}
      romaneios={romaneios}
      tipoFilas={tipoFilas}
      filaAtiva={filaAtiva}
      />
    </Grid>
  </Grid>
  );
}