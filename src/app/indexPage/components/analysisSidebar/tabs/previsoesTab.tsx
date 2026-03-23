import { FaBolt, FaChevronRight, FaClock } from "react-icons/fa6";
import type { Machine } from "@/services/machines/type";

const PREVISAO_TEMPLATES = [
	"Previsão p/ desgaste ferramenta",
	"Revisão de lubrificação",
	"Inspeção de correias",
	"Calibração de eixo",
] as const;

type PrevisoesTabProps = {
	machines: Machine[];
};

export function PrevisoesTab({ machines }: PrevisoesTabProps) {
	const previsoes = machines.slice(0, 8).map((machine, index) => ({
		id: machine.id,
		codigo: machine.codigo,
		text: PREVISAO_TEMPLATES[index % PREVISAO_TEMPLATES.length],
	}));

	return (
		<div className="analysis-sidebar-content">
			<section className="analysis-sidebar-section">
				<h3 className="analysis-sidebar-section-title">
					<FaBolt className="analysis-sidebar-section-title-icon" size={12} aria-hidden />
					Previsões
				</h3>
				{previsoes.length ? (
					<div className="analysis-sidebar-row-group">
						{previsoes.map((item) => (
							<button key={item.id} type="button" className="analysis-sidebar-row">
								<FaClock className="text-secondary flex-shrink-0 opacity-50" size={12} aria-hidden="true" />
								<div className="analysis-sidebar-row-text text-start">
									<span className="d-block text-truncate">{item.text}</span>
									<small className="text-secondary text-truncate d-block">{item.codigo}</small>
								</div>
								<FaChevronRight className="text-secondary flex-shrink-0" size={12} />
							</button>
						))}
					</div>
				) : (
					<small className="text-secondary">Sem previsões.</small>
				)}
			</section>
		</div>
	);
}
