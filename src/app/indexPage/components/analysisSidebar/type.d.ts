import type { Machine } from "@/services/machines/type";

export type AnalysisSidebarTab = "analise" | "previsoes";

export interface AnalysisSidebarProps {
	criticalMachines: Machine[];
	warningMachines: Machine[];
	machines: Machine[];
	onMachineSelect?: (machine: Machine) => void;
}
