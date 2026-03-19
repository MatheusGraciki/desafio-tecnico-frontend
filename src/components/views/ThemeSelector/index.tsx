import { type MouseEvent, useState } from "react";
import { useTheme, type ColorTheme } from "@/contexts/theme-context";
import CheckIcon from "@mui/icons-material/Check";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PaletteIcon from "@mui/icons-material/Palette";
import {
	Box,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Stack,
	Typography,
} from "@mui/material";
import "./styles.scss";

const THEME_LABELS: Record<ColorTheme, { label: string; color: string }> = {
	blueolympic: { label: "Blue Olympic", color: "#4caee5" },
	blueyale: { label: "Blue Yale", color: "#145388" },
	bluenavy: { label: "Blue Navy", color: "#00365a" },
	greenlime: { label: "Green Lime", color: "#6fb327" },
	greenmoss: { label: "Green Moss", color: "#576a3d" },
	greysteel: { label: "Grey Steel", color: "#48494b" },
	orangecarrot: { label: "Orange Carrot", color: "#ed7117" },
	purplemonster: { label: "Purple Monster", color: "#922c88" },
	redruby: { label: "Red Ruby", color: "#900604" },
	yellowgranola: { label: "Yellow Granola", color: "#c0a145" },
};

export function ThemeSelector() {
	const { colorTheme, mode, setColorTheme, toggleMode } = useTheme();
	const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

	const isThemeMenuOpen = Boolean(anchorElement);
	const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) =>
		setAnchorElement(event.currentTarget);
	const handleCloseMenu = () => setAnchorElement(null);

	return (
		<Stack direction="row" spacing={1} alignItems="center" className="theme-selector">
			<IconButton
				onClick={toggleMode}
				title="Alternar modo"
				aria-label="Alternar modo"
				size="small"
				className="theme-selector-icon-button"
			>
				{mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
			</IconButton>

			<IconButton
				onClick={handleOpenMenu}
				title="Selecionar tema"
				aria-label="Selecionar tema"
				size="small"
				className="theme-selector-icon-button"
			>
				<PaletteIcon fontSize="small" />
			</IconButton>

			<Menu
				anchorEl={anchorElement}
				open={isThemeMenuOpen}
				onClose={handleCloseMenu}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				PaperProps={{
					className: "theme-selector-menu-paper",
				}}
			>
				<Typography variant="caption" className="theme-selector-menu-title">
					Tema de Cores
				</Typography>

				{Object.entries(THEME_LABELS).map(([key, { label, color }]) => {
					const isActive = colorTheme === key;
					return (
						<MenuItem
							key={key}
							selected={isActive}
							onClick={() => {
								setColorTheme(key as ColorTheme);
								handleCloseMenu();
							}}
						>
							<ListItemIcon>
								<Box className="theme-selector-color-dot" sx={{ backgroundColor: color }} />
							</ListItemIcon>
							<ListItemText>{label}</ListItemText>
							{isActive && <CheckIcon fontSize="small" />}
						</MenuItem>
					);
				})}
			</Menu>
		</Stack>
	);
}
