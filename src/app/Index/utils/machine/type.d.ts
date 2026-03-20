import type { MachineStatusCategory } from "@/services/machines";

export type StatusTone = "success" | "danger" | "warning" | "secondary";

export interface MachineStatusInfo {
	category: MachineStatusCategory;
	label: string;
	chipColor: StatusTone;
}

export interface MachineStatusCount {
	operando: number;
	alerta: number;
	atencao: number;
	parada: number;
}
