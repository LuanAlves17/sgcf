"use client"

import { Card, Typography, Grid, Box, Button, Chip, Checkbox } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { IRomaneio } from "../../interfaces/IRomaneio";

interface RomaneioProps {
  romaneio: IRomaneio;
  onChamar?: (romaneio: IRomaneio) => void;
  selected?: boolean;
  onSelect?: (romaneio: IRomaneio, checked: boolean) => void;
}

export default function RomaneioCard({ romaneio, selected, onSelect }: RomaneioProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        px: 2,
        py: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        bgcolor: "background.default",
        gap: 2,
      }}
    >
      <Box display="flex" flexDirection="column" flex={1} gap={1}>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Checkbox 
            checked={selected} 
            onChange={(e) => onSelect?.(romaneio, e.target.checked)} 
          />
          <LocalShippingIcon color="success" fontSize="small" />
          <Typography variant="subtitle1" fontWeight={600}>
            Romaneio #{romaneio.nr_romaneio}
          </Typography>
          <Chip
            label={
                <span style={{ fontFamily: 'sans-serif', fontSize: '0.69rem' }}>
                    {romaneio.tipo_romaneio}
                </span>
            }
            size="small"
            color={romaneio.tipo_romaneio === "Embarque" ? "success" : "warning"}
            sx={{ height: 22, fontSize: "0.75rem", fontFamily: 'sans-serif', userSelect:"none" }}
          />
        </Box>

        <Grid container spacing={2} >
          <Grid >
            <Typography variant="body2" color="text.secondary">Placa</Typography>
            <Typography variant="body2" fontWeight={600}>{romaneio.nr_placa_veiculo}</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="text.secondary">Motorista</Typography>
            <Typography variant="body2" fontWeight={600}>{romaneio.nm_motorista.toUpperCase()}</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems={{ xs: "flex-start", sm: "center" }} 
        flexShrink={0}
      >
        <Typography variant="body2" color="text.secondary">Cultura</Typography>
        <Typography variant="body2" fontWeight={600}>{romaneio.cultura}</Typography>
      </Box>
    </Card>
  );
}
