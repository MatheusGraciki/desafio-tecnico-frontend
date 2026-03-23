import { useState } from "react";
import { FaChevronRight, FaCircle, FaClock } from "react-icons/fa6";
import { Card } from "@/components/common/card";
import { MachineChart } from "../machineChart";
import type { AnalysisSidebarProps } from "./type";
import "./styles.scss";

type SidebarTab = "analise" | "previsoes";

const PREVISAO_TEMPLATES = [
	"Previsão p/ desgaste ferramenta",
	"Revisão de lubrificação",
	"Inspeção de correias",
	"Calibração de eixo",
] as const;

export function AnalysisSidebar({
	criticalMachines,
	warningMachines,
	machines,
}: AnalysisSidebarProps) {
	const [tab, setTab] = useState<SidebarTab>("analise");

	const previsoes = machines.slice(0, 8).map((machine, index) => ({
		id: machine.id,
		codigo: machine.codigo,
		text: PREVISAO_TEMPLATES[index % PREVISAO_TEMPLATES.length],
	}));

	return (
		<div className="analysis-sidebar">
			<Card contentStyle={{ padding: "0.75rem 1rem" }}>
				<div className="analysis-sidebar-tabs" role="tablist">
					<button
						type="button"
						role="tab"
						aria-selected={tab === "analise"}
						className={`analysis-sidebar-tab ${tab === "analise" ? "is-active" : ""}`}
						onClick={() => setTab("analise")}
					>
						Análise
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={tab === "previsoes"}
						className={`analysis-sidebar-tab ${tab === "previsoes" ? "is-active" : ""}`}
						onClick={() => setTab("previsoes")}
					>
						Previsões
					</button>
				</div>

				{tab === "analise" ? (
					<div className="analysis-sidebar-content d-flex flex-column">
						<small className="text-secondary fw-semibold">Críticos</small>
						{criticalMachines.length ? (
							criticalMachines.map((machine) => (
								<button
									key={machine.id}
									type="button"
									className="analysis-sidebar-row"
								>
									<FaCircle className="analysis-sidebar-dot text-danger flex-shrink-0" size={8} />
									<div className="analysis-sidebar-row-text text-start">
										<span className="d-block fw-medium text-truncate">{machine.codigo}</span>
										<small className="text-secondary text-truncate d-block">{machine.status}</small>
									</div>
									<FaChevronRight className="text-secondary flex-shrink-0" size={12} />
								</button>
							))
						) : (
							<small className="text-secondary">Sem críticos.</small>
						)}

						<hr className="my-0" />

						<small className="text-secondary fw-semibold">Atenção</small>
						{warningMachines.length ? (
							warningMachines.map((machine) => (
								<button
									key={machine.id}
									type="button"
									className="analysis-sidebar-row"
								>
									<FaCircle className="analysis-sidebar-dot text-warning flex-shrink-0" size={8} />
									<div className="analysis-sidebar-row-text text-start">
										<span className="d-block fw-medium text-truncate">{machine.codigo}</span>
										<small className="text-secondary text-truncate d-block">{machine.status}</small>
									</div>
									<FaChevronRight className="text-secondary flex-shrink-0" size={12} />
								</button>
							))
						) : (
							<small className="text-secondary">Sem itens de atenção.</small>
						)}

						<hr className="my-0" />

						<MachineChart machines={machines} />
					</div>
				) : (
					<div className="analysis-sidebar-content d-flex flex-column">
						<small className="text-secondary fw-semibold">Previsões</small>
						{previsoes.length ? (
							previsoes.map((item) => (
								<button key={item.id} type="button" className="analysis-sidebar-row">
									<FaClock className="text-secondary flex-shrink-0 opacity-50" size={12} aria-hidden="true" />
									<div className="analysis-sidebar-row-text text-start">
										<span className="d-block text-truncate">{item.text}</span>
										<small className="text-secondary text-truncate d-block">{item.codigo}</small>
									</div>
									<FaChevronRight className="text-secondary flex-shrink-0" size={12} />
								</button>
							))
						) : (
							<small className="text-secondary">Sem previsões.</small>
						)}
					</div>
				)}
			</Card>
		</div>
	);
}
