import { useState, type CSSProperties } from "react";
import { useTheme, type ColorTheme } from "@/contexts/theme-context";
import { FaCheck, FaMoon, FaPalette, FaRegSun } from "react-icons/fa6";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
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
	const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

	const handleCloseMenu = () => setIsThemeMenuOpen(false);

	return (
		<div className="theme-selector">
			<Button
				onClick={toggleMode}
				title="Alternar modo"
				aria-label="Alternar modo"
				size="sm"
				className="theme-selector-icon-button btn"
			>
				{mode === "dark" ? <FaRegSun size={14} /> : <FaMoon size={14} />}
			</Button>

			<Dropdown isOpen={isThemeMenuOpen} toggle={() => setIsThemeMenuOpen((prev) => !prev)}>
				<DropdownToggle
					caret
					title="Selecionar tema"
					aria-label="Selecionar tema"
					size="sm"
					className="theme-selector-icon-button"
				>
					<FaPalette size={14} />
				</DropdownToggle>

				<DropdownMenu end className="theme-selector-menu-paper">
					<div className="theme-selector-menu-title">Tema de Cores</div>

					{Object.entries(THEME_LABELS).map(([key, { label, color }]) => {
						const isActive = colorTheme === key;
						const activeItemStyle: CSSProperties | undefined = isActive
							? { backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`, color }
							: undefined;
						return (
							<DropdownItem
								key={key}
								onClick={() => {
									setColorTheme(key as ColorTheme);
									handleCloseMenu();
								}}
								className="theme-selector-menu-item"
								style={activeItemStyle}
							>
								<span className="theme-selector-item-main">
									<span className="theme-selector-color-dot" style={{ backgroundColor: color }} />
									<span className="theme-selector-item-label">{label}</span>
								</span>
								<span
									className="theme-selector-item-check"
									style={isActive ? { color } : undefined}
								>
									{isActive ? <FaCheck size={12} /> : null}
								</span>
							</DropdownItem>
						);
					})}
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}
