import type { MachineData } from "@/services/machines/type";

export type KpiBlock = {
	alerta: string;
	atencao: string;
	totalOper: string;
	efficiency: string;
	efficiencyClass: string;
};

type Status = "alerta" | "atencao" | "operando" | "parada";

const INTERVAL = 60;

const EMPTY_KPI: KpiBlock = {
	alerta: "0h 00m",
	atencao: "0h 00m",
	totalOper: "0h 00m",
	efficiency: "0%",
	efficiencyClass: "text-body fw-semibold",
};

const getStatus = ({ rpm, temperatura }: MachineData): Status => {
	if (rpm <= 100) return "parada";
	if (temperatura >= 75) return "alerta";
	if (temperatura >= 65) return "atencao";
	return "operando";
};

const formatHm = (min: number) =>
	`${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m`;

const getEfficiencyClass = (value: number) =>
	value >= 80
		? "text-success fw-semibold"
		: value >= 50
			? "text-warning fw-semibold"
			: "text-danger fw-semibold";

export function computeKpisFromDados(dados: MachineData[]): KpiBlock {
	if (!dados.length) return EMPTY_KPI;

	const totals = dados.reduce(
		(acc, d) => {
			acc[getStatus(d)] += INTERVAL;
			return acc;
		},
		{ alerta: 0, atencao: 0, operando: 0, parada: 0 },
	);

	const total =
		totals.alerta + totals.atencao + totals.operando + totals.parada;
	const efficiency = total ? Math.round((totals.operando / total) * 100) : 0;

	return {
		alerta: formatHm(totals.alerta),
		atencao: formatHm(totals.atencao),
		totalOper: formatHm(totals.operando),
		efficiency: `${efficiency}%`,
		efficiencyClass: getEfficiencyClass(efficiency),
	};
}
