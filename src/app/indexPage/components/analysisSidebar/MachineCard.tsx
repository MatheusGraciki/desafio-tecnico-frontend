import { FaChevronRight, FaCircle } from "react-icons/fa6";
import type { Machine } from "@/services/machines/type";

type AnalysisSidebarMachineRowProps = {
	machine: Machine;
	variant: "critical" | "warning";
	onSelect?: (machine: Machine) => void;
};

const dotClassByVariant = {
	critical: "text-danger",
	warning: "text-warning",
} as const;

export function MachineCard({ machine, variant, onSelect }: AnalysisSidebarMachineRowProps) {
	return (
		<button type="button" className="analysis-sidebar-row" onClick={() => onSelect?.(machine)}>
			<FaCircle className={`analysis-sidebar-dot ${dotClassByVariant[variant]} flex-shrink-0`} size={8} />
			<div className="analysis-sidebar-row-text text-start">
				<span className="d-block fw-medium text-truncate">{machine.codigo}</span>
				<small
					className={`text-truncate d-block ${variant === "critical" ? "text-danger" : "text-warning"}`}
				>
					{machine.status}
				</small>
			</div>
			<FaChevronRight className="text-secondary flex-shrink-0" size={12} />
		</button>
	);
}
