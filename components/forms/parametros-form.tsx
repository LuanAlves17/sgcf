"use client";
import { Box, Button, Radio, RadioGroup, FormControlLabel, Typography, Switch } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FilaList from "../common/queue-list";
import { IParametro } from "../../interfaces/IParametro"; 

interface ParametrosFormProps {
  parametro: IParametro;
  setParametro: (p: IParametro) => void;
  filas: any[];
  novaFila: string;
  setNovaFila: (v: string) => void;
  onAddFila: () => void;
  onRemoveFila: (id: number) => void;
  onSave: () => void;
}

export default function ParametrosForm({
  parametro,
  setParametro,
  filas,
  novaFila,
  setNovaFila,
  onAddFila,
  onRemoveFila,
  onSave,
}: ParametrosFormProps) {
  return (
    <Box>
      <Typography sx={{ mb: 1 }}>Segregar por Filas?</Typography>
      <RadioGroup
        row
        value={parametro.segregacao_fila ? "sim" : "nao"}
        onChange={e =>
          setParametro({ ...parametro, segregacao_fila: e.target.value === "sim" })
        }
      >
        <FormControlLabel value="sim" control={<Radio />} label="Sim" />
        <FormControlLabel value="nao" control={<Radio />} label="Não" />
      </RadioGroup>

      {parametro.segregacao_fila && (
        <FilaList
          filas={filas}
          novaFila={novaFila}
          setNovaFila={setNovaFila}
          onAdd={onAddFila}
          onRemove={onRemoveFila}
        />
      )}

      <Box sx={{ mt: 3 }}>
        <Typography sx={{ mb: 1 }}>Exibir Fila de Caminhões na TV?</Typography>
        <Switch
          checked={parametro.exibir_fila}
          onChange={e => setParametro({ ...parametro, exibir_fila: e.target.checked })}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={onSave}
          color="success"
          size="small"
          startIcon={<SaveIcon />}
          sx={{ fontWeight: 550 }}
        >
          Salvar
        </Button>
      </Box>
    </Box>
  );
}
