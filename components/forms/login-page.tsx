"use client";

import { Box, Button, Divider, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";

interface LoginPageProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function LoginPage({ onSubmit }: LoginPageProps) {
  return (
    <Grid size={{ xs: 12, md: 4 }} textAlign="center" alignContent={"center"}>
      <Box>
        <Image src="/assets/svg/Logo.svg" alt="Logo do qMonitor" width={250} height={38} />
        <Typography variant="subtitle1">O gerenciador de filas para unidades</Typography>
      </Box>

      <Box
        component="form"
        onSubmit={onSubmit}
        display="flex"
        flexDirection="column"
        mx={5}
        mt={3}
        gap={2}
      >
        <Divider />
        <Typography variant="h5">Login</Typography>

        <TextField
          fullWidth
          required
          name="username"
          label="Nome de Usuário"
          autoComplete="username"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          required
          name="senha"
          label="Senha"
          type="password"
          autoComplete="current-password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="subtitle2" sx={{ opacity: 0.6 }}>
          Use as mesmas credenciais do computador
        </Typography>

        <Button type="submit" variant="contained" color="success" sx={{ fontWeight: 600 }}>
          Entrar
        </Button>
      </Box>
    </Grid>
  );
}
