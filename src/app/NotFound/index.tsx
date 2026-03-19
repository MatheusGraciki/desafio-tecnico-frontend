import { Link } from "react-router-dom";
import { Box, Link as MuiLink, Typography } from "@mui/material";

export default function NotFoundPage() {
	return (
		<Box
			component="section"
			sx={{
				mx: "auto",
				minHeight: "calc(100vh - 14rem)",
				maxWidth: 840,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 0.25,
				textAlign: "center",
			}}
		>
			<Typography variant="h2" fontWeight={700}>
				404
			</Typography>
			<Typography variant="body1" color="text.secondary">
				Página não encontrada.
			</Typography>
			<MuiLink component={Link} to="/" underline="always" color="primary">
				Voltar para início
			</MuiLink>
		</Box>
	);
}
