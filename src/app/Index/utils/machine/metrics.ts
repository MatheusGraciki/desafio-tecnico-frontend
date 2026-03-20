import type { Machine, MachineData } from "@/services/machines/type";
import { getStatusCategory } from "./status";
import type { MachineStatusCount } from "./type";

export function getLastMachineData(machine?: Machine | null): MachineData | undefined {
	if (!machine || !Array.isArray(machine.dados) || machine.dados.length === 0) {
		return undefined;
	}

	return machine.dados[machine.dados.length - 1];
}

export function countMachinesByStatus(machines?: Machine[] | null): MachineStatusCount {
	const safeMachines = Array.isArray(machines) ? machines : [];

	return safeMachines.reduce<MachineStatusCount>(
		(acc, machine) => {
			const category = getStatusCategory(machine?.status);
			acc[category] += 1;
			return acc;
		},
		{ operando: 0, alerta: 0, atencao: 0, parada: 0 },
	);
}
