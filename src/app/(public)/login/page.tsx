"use client";

import { Box, Grid, CircularProgress } from "@mui/material";

import { useLogin } from "../../../../hooks/useLogin";

import LoginPage from "../../../../components/forms/login-page";
import CopyrightCopasul from "../../../../components/ui/copyright-copasul";

const BACKGROUND_IMAGE = `url(/assets/jpeg/bg.jpeg) center / cover no-repeat`;

export default function Login() {
  const { loading, handleSubmit } = useLogin();

  return (
    <Grid container sx={{ height: "100vh" }} wrap="nowrap">
      <Grid
        size={{ md: 8 }}
        sx={{
          background: BACKGROUND_IMAGE,
          display: { xs: "none", md: "flex" },
          justifyContent: "end",
          alignItems: "end",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0, 0, 0, 0.49)" }} />
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <CopyrightCopasul />
        </Box>
      </Grid>

        {loading ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <CircularProgress color="success" />
            </Box>
        ) : (
          <LoginPage onSubmit={handleSubmit} />
        )}
    </Grid>
  );
}
