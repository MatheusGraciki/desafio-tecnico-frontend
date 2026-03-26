import { Container } from "reactstrap";
import { ThemeSelector } from "@/components/views/themeSelector";
import "./styles.scss";

export function AppHeader() {
	return (
		<header className="app-header sticky-top">
			<Container fluid className="app-header-toolbar">
				<div className="app-header-brand navbar">
					<img
						alt="Logo"
						className="app-header-logo"
						src="https://ecoautomacao.com.br/wp-content/uploads/2025/12/eco_logo.png"
					/>
				</div>

				<ThemeSelector />
			</Container>
		</header>
	);
}