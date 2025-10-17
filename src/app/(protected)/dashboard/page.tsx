"use client";

import Header from "../../../../components/header";

import { useUnidade } from "../../../../hooks/useUnidade";
import TruckList from "../../../../components/truck-list";

export default function Dashboard() {
  const { unidade } = useUnidade();

  return (
    <>
      <Header />

      <TruckList unidade={unidade} />
    </>
  );
}
