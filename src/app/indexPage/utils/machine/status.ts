import type { MachineStatusCategory } from "@/services/machines/type";
import type { MachineStatusInfo } from "./type";

export const STATUS_KEYWORDS: Record<MachineStatusCategory, string[]> = {
	operando: ["operando"],
	parada: ["parada", "offline"],
	alerta: [
		"alerta",
		"temp. alta",
		"critico",
		"crítico",
		"gasta",
		"instabilidade",
		"vibração alta",
		"desgaste",
		"pico",
	],
	atencao: ["atenção", "atencao", "manutenção", "manutencao", "baixa"],
};

const STATUS_CONFIG: Record<
	MachineStatusCategory,
	Omit<MachineStatusInfo, "category">
> = {
	operando: { label: "Operando", chipColor: "success" },
	alerta: { label: "Alerta", chipColor: "danger" },
	atencao: { label: "Atenção", chipColor: "warning" },
	parada: { label: "Parada", chipColor: "secondary" },
};

/**
 * Identifica a categoria baseada em palavras-chave dentro da string de status
 */
export function getStatusCategory(
	status?: string | null,
): MachineStatusCategory {
	if (!status) return "parada";

	const normalized = status.toLowerCase().trim();

	// Encontra a primeira categoria onde pelo menos uma keyword está presente no status
	const foundCategory = (
		Object.keys(STATUS_KEYWORDS) as MachineStatusCategory[]
	).find((cat) =>
		STATUS_KEYWORDS[cat].some((keyword) => normalized.includes(keyword)),
	);

	return foundCategory ?? "parada";
}

export function getStatusInfo(status?: string | null): MachineStatusInfo {
	const category = getStatusCategory(status);
	const config = STATUS_CONFIG[category];

	return {
		category,
		...config,
	};
}
