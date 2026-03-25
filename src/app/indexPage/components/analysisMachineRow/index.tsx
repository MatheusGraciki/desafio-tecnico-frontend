import { FaChevronRight, FaCircle } from "react-icons/fa6";
import type { Machine } from "@/services/machines/type";
import type { AnalysisMachineRowVariant } from "./types";

export type { AnalysisMachineRowVariant } from "./types";

const dotClassByVariant: Record<AnalysisMachineRowVariant, string> = {
	critical: "text-danger",
	warning: "text-warning",
	success: "text-success",
	neutral: "text-secondary",
};

const statusTextClassByVariant: Record<AnalysisMachineRowVariant, string> = {
	critical: "text-danger",
	warning: "text-warning",
	success: "text-success",
	neutral: "text-secondary",
};

export type AnalysisMachineRowProps = {
	machine: Machine;
	variant: AnalysisMachineRowVariant;
	onSelect?: (machine: Machine) => void;
};

export function AnalysisMachineRow({ machine, variant, onSelect }: AnalysisMachineRowProps) {
	return (
		<button
			type="button"
			className="analysis-sidebar-row"
			onClick={() => onSelect?.(machine)}
		>
			<FaCircle
				className={`analysis-sidebar-dot ${dotClassByVariant[variant]}`}
				size={15}
				aria-hidden
			/>
			<div className="analysis-sidebar-row-text text-start">
				<span className="d-block fw-medium text-truncate">{machine.codigo}</span>
				<small className={`text-truncate d-block ${statusTextClassByVariant[variant]}`}>
					{machine.status}
				</small>
			</div>
			<FaChevronRight className="text-secondary flex-shrink-0" size={12} aria-hidden />
		</button>
	);
}
