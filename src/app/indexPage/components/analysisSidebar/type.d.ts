import type { Machine } from "@/services/machines/type";

export interface AnalysisSidebarProps {
	analysisOpen: boolean;
	onToggle: () => void;
	criticalMachines: Machine[];
	warningMachines: Machine[];
	machines: Machine[];
}