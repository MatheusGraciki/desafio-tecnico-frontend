import { useTheme, type ColorTheme } from "@/contexts/theme-context";
import { fetchMachines } from "@/services/machines";
import { Box, Button, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useEffect } from "react";

export default function IndexPage() {
	const { colorTheme, mode, toggleMode, setColorTheme, availableThemes } = useTheme();

	useEffect(() => {
		fetchMachines().then((data) => {
			console.debug("Máquinas:", data);
		});
	}, []);

	return (
		<Box
			component="section"
			sx={{
				maxWidth: 840,
				mx: "auto",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				textAlign: "center",
				gap: { xs: 1, sm: 1.25 },
			}}
		>
			<Box>
				<Typography variant="h4" fontWeight={700}>
					ECO Automação Industrial
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
					Sistema white-label com temas dinâmicos e modo claro/escuro
				</Typography>
			</Box>

			<Box sx={{ width: "100%", maxWidth: { xs: 420, sm: "none" } }}>
				<Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 0.75 }}>
					Tema Atual: <strong>{colorTheme}</strong> ({mode})
				</Typography>

				<Box
					sx={{
						width: { xs: "100%", sm: "auto" },
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
					}}
				>
					<Button
						variant="contained"
						onClick={toggleMode}
						size="small"
						sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { sm: 200 } }}
					>
						Modo: {mode === "light" ? "Claro → Escuro" : "Escuro → Claro"}
					</Button>

					<FormControl sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { sm: 200 } }}>
						<Select
							value={colorTheme}
							size="small"
							onChange={(event) => {
								const nextTheme = event.target.value as ColorTheme;
								setColorTheme(nextTheme);
							}}
						>
							{availableThemes.map((themeName) => (
								<MenuItem key={themeName} value={themeName}>
									{themeName}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</Box>
		</Box>
	);
}
