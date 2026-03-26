import type { Machine } from "@/services/machines/type";
import { isToday } from "../date";
import { getStatusCategory } from "./status";

/** Máquina em categoria alerta com `ultimaAtualizacao` no dia corrente (ex.: card “+N hoje”). */
export function isMachineAlertRegisteredToday(machine: Machine): boolean {
	return (
		getStatusCategory(machine.status) === "alerta" &&
		isToday(machine.ultimaAtualizacao)
	);
}
