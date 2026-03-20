import { createContext, useContext } from "react";

export const THEME_NAMES = [
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

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return context;
}
