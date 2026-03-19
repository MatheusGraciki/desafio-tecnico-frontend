import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const THEME_NAMES = [
  "blueolympic",
  "blueyale",
  "bluenavy",
  "greenlime",
  "greenmoss",
  "greysteel",
  "orangecarrot",
  "purplemonster",
  "redruby",
  "yellowgranola",
] as const;

export type ColorTheme = (typeof THEME_NAMES)[number];
export type Mode = "light" | "dark";

interface ThemeContextType {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  availableThemes: readonly ColorTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY_THEME = "app-color-theme";
const STORAGE_KEY_MODE = "app-mode";

function getStoredValue<T extends string>(
  key: string,
  fallback: T,
  valid: readonly string[],
): T {
  try {
    const value = localStorage.getItem(key);
    if (value && valid.includes(value)) return value as T;
  } catch {
    return fallback;
  }

  return fallback;
}

function getSystemMode(): Mode {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() =>
    getStoredValue(STORAGE_KEY_THEME, "blueolympic", THEME_NAMES),
  );

  const [mode, setModeState] = useState<Mode>(() =>
    getStoredValue(STORAGE_KEY_MODE, getSystemMode(), ["light", "dark"]),
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);

    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      return;
    }
  }, []);

  const setMode = useCallback((value: Mode) => {
    setModeState(value);

    try {
      localStorage.setItem(STORAGE_KEY_MODE, value);
    } catch {
      return;
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider
      value={{
        colorTheme,
        mode,
        setColorTheme,
        setMode,
        toggleMode,
        availableThemes: THEME_NAMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
