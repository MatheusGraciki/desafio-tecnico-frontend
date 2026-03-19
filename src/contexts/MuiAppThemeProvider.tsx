import type { PropsWithChildren } from "react";
import { useMemo, useState, useEffect } from "react";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import { useTheme as useAppTheme } from "@/contexts/ThemeContext";

const CSS_VAR_KEYS = {
  primary: "primary",
  primaryForeground: "primary-foreground",
  secondary: "secondary",
  secondaryForeground: "secondary-foreground",
  destructive: "destructive",
  destructiveForeground: "destructive-foreground",
  background: "background",
  card: "card",
  foreground: "foreground",
  mutedForeground: "muted-foreground",
} as const;

function getCssVariableValue(variableName: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${variableName}`)
    .trim();
  return value || "#000000";
}

function readCssVariables() {
  return Object.fromEntries(
    Object.entries(CSS_VAR_KEYS).map(([key, cssVar]) => [
      key,
      getCssVariableValue(cssVar),
    ]),
  ) as Record<keyof typeof CSS_VAR_KEYS, string>;
}

export function MuiAppThemeProvider({ children }: PropsWithChildren) {
  const { mode, colorTheme } = useAppTheme();
  const [cssVars, setCssVars] = useState(readCssVariables());

  useEffect(() => {
    requestAnimationFrame(() => {
      setCssVars(readCssVariables());
    });
  }, [colorTheme, mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: cssVars.primary,
            contrastText: cssVars.primaryForeground,
          },
          secondary: {
            main: cssVars.secondary,
            contrastText: cssVars.secondaryForeground,
          },
          error: {
            main: cssVars.destructive,
            contrastText: cssVars.destructiveForeground,
          },
          background: {
            default: cssVars.background,
            paper: cssVars.card,
          },
          text: {
            primary: cssVars.foreground,
            secondary: cssVars.mutedForeground,
          },
        },
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }),
    [mode, cssVars],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
