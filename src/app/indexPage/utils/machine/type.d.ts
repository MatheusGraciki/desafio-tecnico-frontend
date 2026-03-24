import type { MachineStatusCategory } from "@/services/machines/type";

// Status
export type StatusTone = "success" | "danger" | "warning" | "secondary";
export interface MachineStatusInfo {
	category: MachineStatusCategory;
	label: string;
	chipColor: StatusTone;
}

// metrics
export interface MachineStatusCount {
	operando: number;
	alerta: number;
	atencao: number;
	parada: number;
}

// image
export type MatchType = "all";

export interface MachineRule {
	keywords: string[];
	image: string;
	match?: MatchType;
}
