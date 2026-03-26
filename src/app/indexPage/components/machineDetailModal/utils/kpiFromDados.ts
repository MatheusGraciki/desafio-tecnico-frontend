import type { MachineData } from "@/services/machines/type";

export type KpiBlock = {
	alerta: string;
	atencao: string;
	totalOper: string;
	efficiency: string;
	efficiencyClass: string;
};

export type TelemetryStatus = "alerta" | "atencao" | "operando" | "parada";

type StatusMinutes = {
	alerta: number;
	atencao: number;
	operando: number;
};

const RULES = {
	minutesPerSample: 60,
	stopRpm: 100,
	attentionRpm: 2200,
	alertRpm: 5000,
	attentionTemp: 65,
	alertTemp: 75,
} as const;

const EFFICIENCY_BY_STATUS: Record<TelemetryStatus, number> = {
	operando: 100,
	atencao: 60,
	alerta: 30,
	parada: 0,
};

const EMPTY_KPI: KpiBlock = {
	alerta: "0h 00m",
	atencao: "0h 00m",
	totalOper: "0h 00m",
	efficiency: "0%",
	efficiencyClass: "text-body fw-semibold",
};

/**
 * Como a API não envia o status por amostra, inferi o estado da máquina
 * a partir dos valores de RPM e temperatura de cada ponto da telemetria.
 */
export function getTelemetryStatus({
	rpm,
	temperatura,
}: Pick<MachineData, "rpm" | "temperatura">): TelemetryStatus {
	if (rpm <= RULES.stopRpm) return "parada";
	if (rpm <= RULES.attentionRpm) return "atencao";
	if (rpm >= RULES.alertRpm) return "alerta";
	if (temperatura >= RULES.alertTemp) return "alerta";
	if (temperatura >= RULES.attentionTemp) return "atencao";

	return "operando";
}

function formatMinutes(totalMinutes: number): string {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function getEfficiencyClass(percentage: number): string {
	if (percentage >= 80) return "text-success fw-semibold";
	if (percentage >= 50) return "text-warning fw-semibold";
	return "text-danger fw-semibold";
}

function createEmptyStatusMinutes(): StatusMinutes {
	return {
		alerta: 0,
		atencao: 0,
		operando: 0,
	};
}

function sumMinutesByStatus(dados: MachineData[]): StatusMinutes {
	const totals = createEmptyStatusMinutes();

	for (const sample of dados) {
		const status = getTelemetryStatus(sample);

		if (status === "alerta") {
			totals.alerta += RULES.minutesPerSample;
			continue;
		}

		if (status === "atencao") {
			totals.atencao += RULES.minutesPerSample;
			continue;
		}

		if (status === "operando") {
			totals.operando += RULES.minutesPerSample;
		}
	}

	return totals;
}

export function computeKpisFromDados(dados: MachineData[]): KpiBlock {
	if (!dados.length) return EMPTY_KPI;

	const totals = sumMinutesByStatus(dados);
	const currentStatus = getTelemetryStatus(dados[dados.length - 1]);
	const efficiencyPercentage = EFFICIENCY_BY_STATUS[currentStatus];

	return {
		alerta: formatMinutes(totals.alerta),
		atencao: formatMinutes(totals.atencao),
		totalOper: formatMinutes(totals.operando),
		efficiency: `${efficiencyPercentage}%`,
		efficiencyClass: getEfficiencyClass(efficiencyPercentage),
	};
}
