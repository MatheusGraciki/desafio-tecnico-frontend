import type { MachineStatusCategory } from "@/services/machines/type";
import type { AnalysisMachineRowVariant } from "./types";

export function statusCategoryToRowVariant(
	category: MachineStatusCategory,
): AnalysisMachineRowVariant {
	switch (category) {
		case "alerta":
			return "critical";
		case "atencao":
			return "warning";
		case "operando":
			return "success";
		case "parada":
			return "neutral";
	}
}
