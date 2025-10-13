"use client";
import { Box, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IFila } from "../../interfaces/IParametro"; 

interface FilaListProps {
  filas: IFila[];
  novaFila: string;
  setNovaFila: (v: string) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
}

export default function FilaList({ filas, novaFila, setNovaFila, onAdd, onRemove }: FilaListProps) {
  return (
    <Box sx={{ mt: 2 }}>
      {filas.map(fila => (
        <Box key={fila.id} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <TextField size="small" fullWidth value={fila.nome_fila} disabled />
          <IconButton onClick={() => onRemove(fila.id)} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <TextField
          size="small"
          placeholder="Nome da Fila"
          value={novaFila}
          onChange={e => setNovaFila(e.target.value)}
          fullWidth
        />
        <IconButton onClick={onAdd}>
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
