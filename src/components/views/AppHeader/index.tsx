import { AppBar, Box, Toolbar } from "@mui/material";
import { ThemeSelector } from "@/components/views/ThemeSelector";
import "./styles.scss";

export function AppHeader() {
  return (
    <AppBar position="sticky" elevation={1} color="inherit" className="app-header">
      <Toolbar className="app-header-toolbar">
        <Box className="app-header-brand">
          <img
            src="https://ecoautomacao.com.br/wp-content/uploads/2025/12/eco_logo.png"
            alt="ECO Automação"
            className="app-header-logo"
          />
        </Box>

        <ThemeSelector />
      </Toolbar>
    </AppBar>
  );
}