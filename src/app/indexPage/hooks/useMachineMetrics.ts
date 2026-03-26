import { useMemo } from "react";

import type { Machine } from "@/services/machines/type";
import { isSameCalendarDay } from "../utils/date";
import { countMachinesByStatus, getStatusCategory } from "../utils/machine";
import type { MachineStatusCount } from "../utils/machine/type";

export function useMachineMetrics(machines: Machine[]) {
	const statusCounts = useMemo<MachineStatusCount>(
		() => countMachinesByStatus(machines),
		[machines],
	);

	const alertsEnteredToday = useMemo(
		() =>
			machines.filter(
				(machine) =>
					getStatusCategory(machine.status) === "alerta" &&
					isSameCalendarDay(machine.ultimaAtualizacao),
			).length,
		[machines],
	);

	const criticalMachines = useMemo(
		() =>
			machines.filter(
				(machine) => getStatusCategory(machine.status) === "alerta",
			),
		[machines],
	);

	const warningMachines = useMemo(
		() =>
			machines.filter(
				(machine) => getStatusCategory(machine.status) === "atencao",
			),
		[machines],
	);

	return {
		statusCounts,
		alertsEnteredToday,
		criticalMachines,
		warningMachines,
	};
}
