import type { Machine } from "@/services/machines/type";

export interface AnalysisSidebarProps {
	criticalMachines: Machine[];
	warningMachines: Machine[];
	machines: Machine[];
}
