import { FaBolt } from "react-icons/fa6";
import { MachineChart } from "../../machineChart";
import { MachineCard } from "../MachineCard";
import type { Machine } from "@/services/machines/type";

type AnalysisSidebarAnaliseTabProps = {
	criticalMachines: Machine[];
	warningMachines: Machine[];
	machines: Machine[];
	onMachineSelect?: (machine: Machine) => void;
};

export function AnaliseTab({
	criticalMachines,
	warningMachines,
	machines,
	onMachineSelect,
}: AnalysisSidebarAnaliseTabProps) {
	return (
		<div className="analysis-sidebar-content">
			<section className="analysis-sidebar-section">
				<h3 className="analysis-sidebar-section-title">
					<FaBolt className="analysis-sidebar-section-title-icon" size={12} aria-hidden />
					Críticos
				</h3>
				{criticalMachines.length ? (
					<div className="analysis-sidebar-row-group">
						{criticalMachines.map((machine) => (
							<MachineCard
								key={machine.id}
								machine={machine}
								variant="critical"
								onSelect={onMachineSelect}
							/>
						))}
					</div>
				) : (
					<small className="text-secondary">Sem críticos.</small>
				)}
			</section>

			<section className="analysis-sidebar-section">
				<h3 className="analysis-sidebar-section-title">
					<FaBolt className="analysis-sidebar-section-title-icon" size={12} aria-hidden />
					Atenção
				</h3>
				{warningMachines.length ? (
					<div className="analysis-sidebar-row-group">
						{warningMachines.map((machine) => (
							<MachineCard
								key={machine.id}
								machine={machine}
								variant="warning"
								onSelect={onMachineSelect}
							/>
						))}
					</div>
				) : (
					<small className="text-secondary">Sem itens de atenção.</small>
				)}
			</section>

			<section className="analysis-sidebar-section">
				<MachineChart machines={machines} />
			</section>
		</div>
	);
}
