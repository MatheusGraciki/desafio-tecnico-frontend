import type { PropsWithChildren } from "react";
import { useMemo, useState, useCallback, useLayoutEffect } from "react";
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { ThemeContext, THEME_NAMES, type ColorTheme, type Mode } from "@/contexts/theme-context";

const STORAGE_KEY_THEME = "app-color-theme-v2";
const STORAGE_KEY_MODE = "app-mode-v2";

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
		Object.entries(CSS_VAR_KEYS).map(([key, cssVar]) => [key, getCssVariableValue(cssVar)]),
	) as Record<keyof typeof CSS_VAR_KEYS, string>;
}

function getStoredValue<T extends string>(key: string, fallback: T, valid: readonly string[]): T {
	try {
		const value = localStorage.getItem(key);
		if (value && valid.includes(value)) return value as T;
	} catch {
		return fallback;
	}

	return fallback;
}

export function MuiAppThemeProvider({ children }: PropsWithChildren) {
	const [colorTheme, setColorThemeState] = useState<ColorTheme>(() =>
		getStoredValue(STORAGE_KEY_THEME, "greenlime", THEME_NAMES),
	);

	const [mode, setModeState] = useState<Mode>(() =>
		getStoredValue(STORAGE_KEY_MODE, "light", ["light", "dark"]),
	);

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

	useLayoutEffect(() => {
		document.documentElement.setAttribute("data-theme", colorTheme);
		document.documentElement.classList.toggle("dark", mode === "dark");
		setCssVars(readCssVariables());
	}, [colorTheme, mode]);

	const [cssVars, setCssVars] = useState(readCssVariables());

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
					fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
				},
			}),
		[mode, cssVars],
	);

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
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
}
