import type { Machine } from "@/services/machines/type";
import { STATUS_KEYWORDS } from "./status";

function normalizeText(value: string): string {
	return value.toLowerCase().trim();
}

function isAlertaLabel(label: string): boolean {
	const normalizedLabel = normalizeText(label);

	return STATUS_KEYWORDS.alerta.some((keyword) =>
		normalizedLabel.includes(normalizeText(keyword)),
	);
}

export function getMachineAlertaLabels(machine: Machine): string[] {
	if (!machine.alertas?.length) return [];

	const uniqueLabels = new Set<string>();

	for (const label of machine.alertas) {
		const normalizedLabel = normalizeText(label);

		if (!normalizedLabel) continue;
		if (!isAlertaLabel(label)) continue;

		uniqueLabels.add(label);
	}

	return [...uniqueLabels];
}

const TEMP_ALTA_KEYWORD =
	STATUS_KEYWORDS.alerta.find((k) => normalizeText(k).includes("temp")) ??
	"temp. alta";

/** Algum alerta classificado como alerta menciona temperatura alta (`STATUS_KEYWORDS.alerta`). */
export function hasTemperaturaAltaAlert(machine: Machine): boolean {
	return getMachineAlertaLabels(machine).some((label) =>
		normalizeText(label).includes(normalizeText(TEMP_ALTA_KEYWORD)),
	);
}

export function hasMachineAlerta(machine: Machine): boolean {
	return getMachineAlertaLabels(machine).length > 0;
}
