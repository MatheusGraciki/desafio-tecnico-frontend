import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Badge, Button } from "reactstrap";
import { Card } from "@/components/common/card";
import { MachineChart } from "../machineChart";
import type { AnalysisSidebarProps } from "./type";
import "./styles.scss";

export function AnalysisSidebar({
	analysisOpen,
	onToggle,
	criticalMachines,
	warningMachines,
	machines,
}: AnalysisSidebarProps) {
	return (
		<div
			className={`analysis-sidebar ${analysisOpen ? "analysis-sidebar-open" : "analysis-sidebar-closed"}`}
		>
			{analysisOpen ? (
				<Card
					title="Análise"
					action={
						<Button color="link" className="p-0" onClick={onToggle} aria-label="Fechar análise">
							<FaChevronRight size={12} />
						</Button>
					}
				>
					<div className="analysis-sidebar-content d-flex flex-column">
						<small className="text-secondary fw-semibold">Críticos</small>
						{criticalMachines.length ? (
							criticalMachines.map((machine) => (
								<div
									key={machine.id}
									className="d-flex justify-content-between align-items-center gap-2"
								>
									<span>{machine.codigo}</span>
									<Badge color="danger" pill>
										{machine.status}
									</Badge>
								</div>
							))
						) : (
							<small className="text-secondary">Sem críticos.</small>
						)}

						<hr className="my-0" />

						<small className="text-secondary fw-semibold">Atenção</small>
						{warningMachines.length ? (
							warningMachines.map((machine) => (
								<div
									key={machine.id}
									className="d-flex justify-content-between align-items-center gap-2"
								>
									<span>{machine.codigo}</span>
									<Badge color="warning" className="text-dark" pill>
										{machine.status}
									</Badge>
								</div>
							))
						) : (
							<small className="text-secondary">Sem itens de atenção.</small>
						)}

						<hr className="my-0" />

						<MachineChart machines={machines} />
					</div>
				</Card>
			) : (
				<div className="analysis-sidebar-toggle">
					<Button color="link" className="p-0" onClick={onToggle} aria-label="Abrir análise">
						<FaChevronLeft size={12} />
					</Button>
				</div>
			)}
		</div>
	);
}
