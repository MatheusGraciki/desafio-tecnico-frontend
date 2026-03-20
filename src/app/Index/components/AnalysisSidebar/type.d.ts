import type { Machine, MachineData } from "@/services/machines";

export interface AnalysisSidebarProps {
	analysisOpen: boolean;
	onToggle: () => void;
	criticalMachines: Machine[];
	warningMachines: Machine[];
	timelineData: MachineData[];
}
