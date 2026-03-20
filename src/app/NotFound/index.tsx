import { Link } from "react-router-dom";
import { Container } from "reactstrap";

export default function NotFoundPage() {
	return (
		<Container
			tag="section"
			className="d-flex flex-column align-items-center justify-content-center text-center"
			style={{ minHeight: "calc(100vh - 14rem)", maxWidth: 840 }}
		>
			<h1 className="display-3 fw-bold mb-1">404</h1>
			<p className="text-secondary mb-2">Página não encontrada.</p>
			<Link to="/">Voltar para início</Link>
		</Container>
	);
}
