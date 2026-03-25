import type { Machine } from "@/services/machines/type";

export function hasTemperaturaAltaAlert(machine: Machine): boolean {
	return (
		machine.alertas?.some((alerta) =>
			alerta.toLowerCase().includes("temp. alta"),
		) ?? false
	);
}
