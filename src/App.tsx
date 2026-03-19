import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MuiAppThemeProvider } from "@/contexts/MuiAppThemeProvider";
import { AppRoutes } from "@/app/routes";

const App = () => (
  <ThemeProvider>
    <MuiAppThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MuiAppThemeProvider>
  </ThemeProvider>
);

export default App;
