import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";

export function HeaderTV({unidade}: {unidade: string}) {
    return (
        <Grid container alignItems="center" justifyContent="space-between" sx={{ background: "#252525", p: 1 }}>
            <Typography fontWeight={600} color="white" variant="h6">{unidade}</Typography>
            <Typography fontWeight={600} color="white" variant="h5" textAlign="center" sx={{ flex: 1 }}>
            ACOMPANHE A FILA
            </Typography>
            
            <Box sx={{ width: 110 }}>
                <Image src="/assets/png/LogoCopasul.png" alt="Logo" width={110} height={40} style={{ objectFit: "contain" }} />
            </Box>
        </Grid>
    );
}