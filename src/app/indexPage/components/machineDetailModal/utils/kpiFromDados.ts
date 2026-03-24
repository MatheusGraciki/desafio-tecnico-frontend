import type { MachineData, MachineStatusCategory } from "@/services/machines/type";

export type KpiBlock = {
	alerta: string;
	atencao: string;
	totalOper: string;
	efficiency: string;
	efficiencyClass: string;
};

function parseTs(iso: string): number {
	const t = new Date(iso).getTime();
	return Number.isNaN(t) ? 0 : t;
}

function formatHm(totalMinutes: number): string {
	if (totalMinutes <= 0) return "0h 00m";
	const h = Math.floor(totalMinutes / 60);
	const m = Math.round(totalMinutes % 60);
	return `${h}h ${String(m).padStart(2, "0")}m`;
}

function sortedChronological(dados: MachineData[]): MachineData[] {
	return [...dados].sort((a, b) => parseTs(a.timestamp) - parseTs(b.timestamp));
}

/** Duração (min) associada a cada ponto: até o próximo timestamp; no último, repete o intervalo anterior. */
function minutesPerPoint(sorted: MachineData[]): number[] {
	const n = sorted.length;
	if (n === 0) return [];
	if (n === 1) return [60];

	const out: number[] = [];
	for (let i = 0; i < n; i++) {
		if (i < n - 1) {
			const mins = (parseTs(sorted[i + 1].timestamp) - parseTs(sorted[i].timestamp)) / 60000;
			out.push(Math.max(0, mins));
		} else {
			const mins = (parseTs(sorted[i].timestamp) - parseTs(sorted[i - 1].timestamp)) / 60000;
			out.push(Math.max(0, mins));
		}
	}
	return out;
}

function median(values: number[]): number {
	if (!values.length) return 0;
	const s = [...values].sort((a, b) => a - b);
	const mid = Math.floor(s.length / 2);
	return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

function p90(values: number[]): number {
	if (!values.length) return 0;
	const s = [...values].sort((a, b) => a - b);
	const idx = Math.min(s.length - 1, Math.ceil(0.9 * s.length) - 1);
	return s[idx]!;
}

/**
 * Classifica cada amostra com base nos sensores (API não envia status por timestamp).
 * - parada: RPM baixo / parado
 * - alerta: temperatura crítica ou pico de potência na série
 * - atencao: faixa intermediária de temperatura ou potência elevada
 * - operando: regime estável
 */
function classifyPoint(
	d: MachineData,
	medianPotRunning: number,
	p90PotRunning: number,
): MachineStatusCategory {
	const running = d.rpm > 100;
	if (!running) return "parada";

	if (d.temperatura >= 75) return "alerta";
	if (d.temperatura >= 65) return "atencao";

	if (medianPotRunning > 0 && p90PotRunning > 0) {
		if (d.potencia >= p90PotRunning * 1.12) return "alerta";
		if (d.potencia >= medianPotRunning * 1.1) return "atencao";
	}

	return "operando";
}

function efficiencyClassFromPct(pct: number): string {
	if (pct >= 80) return "text-success fw-semibold";
	if (pct >= 50) return "text-warning fw-semibold";
	return "text-danger fw-semibold";
}

export function computeKpisFromDados(dados: MachineData[]): KpiBlock {
	if (!dados.length) {
		return {
			alerta: "0h 00m",
			atencao: "0h 00m",
			totalOper: "0h 00m",
			efficiency: "—",
			efficiencyClass: "text-body fw-semibold",
		};
	}

	const sorted = sortedChronological(dados);
	const mins = minutesPerPoint(sorted);
	const runningPoints = sorted.filter((d) => d.rpm > 100);
	const potencias = runningPoints.map((d) => d.potencia);
	const medianPot = median(potencias);
	const p90Pot = p90(potencias.length ? potencias : [0]);

	let minutesAlerta = 0;
	let minutesAtencao = 0;
	let minutesOperando = 0;
	let minutesParada = 0;

	for (let i = 0; i < sorted.length; i++) {
		const cat = classifyPoint(sorted[i]!, medianPot, p90Pot);
		const m = mins[i] ?? 0;
		if (cat === "alerta") minutesAlerta += m;
		else if (cat === "atencao") minutesAtencao += m;
		else if (cat === "operando") minutesOperando += m;
		else minutesParada += m;
	}

	const totalTracked =
		minutesAlerta + minutesAtencao + minutesOperando + minutesParada;
	const efficiencyPct =
		totalTracked > 0 ? Math.round((100 * minutesOperando) / totalTracked) : 0;

	return {
		alerta: formatHm(minutesAlerta),
		atencao: formatHm(minutesAtencao),
		totalOper: formatHm(minutesOperando),
		efficiency: `${efficiencyPct}%`,
		efficiencyClass: efficiencyClassFromPct(efficiencyPct),
	};
}
