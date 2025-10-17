"use client";

import { useEffect, useState } from "react";
import { Box, Tooltip, Zoom } from "@mui/material";
import { colors } from "../../constants/colors";

const styles = {
  boxTimeLocal: {
    padding: "7px 15px",
    border: `2px solid ${colors.first}`,
    borderRadius: 1,
    userSelect: "none",
    fontFamily: "sans-serif",
    color: colors.first
  },
};

export default function TimeLocal(props: any) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("pt-BR"));
    update(); 
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <Tooltip
      title="Horário definido pelo servidor"
      color="success.main"
      slots={{ transition: Zoom }}
    >
      <Box sx={styles.boxTimeLocal}>{time}</Box>
    </Tooltip>
  );
}
