"use client"

import { useEffect, useState } from "react";
import { Box, Tooltip, Zoom } from "@mui/material";
import { colors } from "../../constants/colors";

const styles = {
    boxTimeLocal: {
        padding: '7px 15px',
        border: `2px solid ${colors.first}`,
        color: colors.first,
        borderRadius: 1,
        userSelect: 'none',
        fontFamily: 'sans-serif'
    }
}

export default function TimeLocal() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip title="Horário definido pelo servidor" color="success.main" slots={{ transition: Zoom }}>
        <Box sx={styles.boxTimeLocal}>
            {new Date(time).toLocaleTimeString()} 
        </Box>
    </Tooltip>
  );
}