import type { PropsWithChildren } from "react";
import { useState, useCallback, useLayoutEffect } from "react";
import { ThemeContext, THEME_NAMES, type ColorTheme, type Mode } from "@/contexts/themeContext";

const STORAGE_KEY_THEME = "app-color-theme-v2";
const STORAGE_KEY_MODE = "app-mode-v2";

function getStoredValue<T extends string>(key: string, fallback: T, valid: readonly string[]): T {
	try {
		const value = localStorage.getItem(key);
		if (value && valid.includes(value)) return value as T;
	} catch {
		return fallback;
	}

	return fallback;
}

export function ThemeProvider({ children }: PropsWithChildren) {
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
		const themeClassNames = THEME_NAMES.flatMap((themeName) => [
			`light-${themeName}`,
			`dark-${themeName}`,
		]);

		document.documentElement.classList.remove(...themeClassNames);
		document.documentElement.classList.add(`${mode}-${colorTheme}`);
		document.documentElement.setAttribute("data-theme", colorTheme);
		document.documentElement.classList.toggle("dark", mode === "dark");
		document.documentElement.setAttribute("data-bs-theme", mode);
	}, [colorTheme, mode]);

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
