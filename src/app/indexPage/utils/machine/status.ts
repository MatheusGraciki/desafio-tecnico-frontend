import type { MachineStatusCategory } from "@/services/machines/type";
import type { MachineStatusInfo } from "./type";
// Refatorar
const STATUS_KEYWORDS = {
	operando: ["operando"],
	parada: ["parada", "offline"],
	alerta: [
		"alerta",
		"alta",
		"critico",
		"crítico",
		"gasta",
		"instabilidade",
		"vibração",
	],
	atencao: ["atenção", "atencao", "manutenção", "manutencao", "baixa"],
} as const;

function normalizeStatus(status?: string | null) {
	if (typeof status !== "string") return "";
	return status.toLowerCase().trim();
}

export function getStatusCategory(
	status?: string | null,
): MachineStatusCategory {
	const normalized = normalizeStatus(status);

	if (!normalized) {
		return "parada";
	}

	if (
		STATUS_KEYWORDS.operando.some((keyword) => normalized.includes(keyword))
	) {
		return "operando";
	}

	if (STATUS_KEYWORDS.parada.some((keyword) => normalized.includes(keyword))) {
		return "parada";
	}

	if (STATUS_KEYWORDS.alerta.some((keyword) => normalized.includes(keyword))) {
		return "alerta";
	}

	if (STATUS_KEYWORDS.atencao.some((keyword) => normalized.includes(keyword))) {
		return "atencao";
	}

	return "parada";
}

export function getStatusInfo(status?: string | null): MachineStatusInfo {
	const category = getStatusCategory(status);

	if (category === "operando") {
		return { category, label: "Operando", chipColor: "success" };
	}

	if (category === "alerta") {
		return { category, label: "Alerta", chipColor: "danger" };
	}

	if (category === "atencao") {
		return { category, label: "Atenção", chipColor: "warning" };
	}

	if (category === "parada") {
		return { category, label: "Parada", chipColor: "secondary" };
	}

	return { category: "parada", label: "Parada", chipColor: "secondary" };
}
