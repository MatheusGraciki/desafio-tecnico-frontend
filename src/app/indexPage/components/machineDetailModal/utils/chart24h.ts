import type { MachineData } from "@/services/machines/type";
import type { TelemetryStatus } from "./kpiFromDados";
import { getTelemetryStatus } from "./kpiFromDados";

export type Chart24hPoint = {
	timeMs: number;
	rpm: number;
	/** Tooltip */
	label: string;
	/** Pior status entre amostras da hora (para cor no gráfico). */
	telemetryStatus: TelemetryStatus;
};

export type Chart24hAxis = {
	domainStart: number;
	domainEnd: number;
	ticks: number[];
};

const MS_24H = 24 * 60 * 60 * 1000;
const MS_30M = 30 * 60 * 1000;

function formatTooltipLabel(timeMs: number): string {
	return new Date(timeMs).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function hourStartLocalMs(timeMs: number): number {
	const d = new Date(timeMs);
	d.setMinutes(0, 0, 0);
	return d.getTime();
}

/**
 * Últimas 24 h: um ponto por hora (média de RPM) só para horas que tiverem amostra.
 * Eixo X = intervalo entre primeira e última hora com dado (sem área “vazia” de 24h inteiras).
 */
export function build24hChartSeries(dados: MachineData[]): {
	points: Chart24hPoint[];
	axis: Chart24hAxis;
} {
	const domainEnd = Date.now();
	const windowStart = domainEnd - MS_24H;

	const STATUS_RANK: Record<TelemetryStatus, number> = {
		parada: 0,
		operando: 1,
		atencao: 2,
		alerta: 3,
	};

	function pickWorst(a: TelemetryStatus, b: TelemetryStatus): TelemetryStatus {
		return STATUS_RANK[a] >= STATUS_RANK[b] ? a : b;
	}

	const buckets = new Map<
		number,
		{ sum: number; n: number; worst: TelemetryStatus }
	>();

	for (const d of dados) {
		const timeMs = new Date(d.timestamp).getTime();
		if (Number.isNaN(timeMs) || timeMs < windowStart || timeMs > domainEnd) continue;
		const hourMs = hourStartLocalMs(timeMs);
		const st = getTelemetryStatus(d);
		const cur = buckets.get(hourMs);
		if (cur) {
			cur.sum += d.rpm;
			cur.n += 1;
			cur.worst = pickWorst(cur.worst, st);
		} else {
			buckets.set(hourMs, { sum: d.rpm, n: 1, worst: st });
		}
	}

	const sortedHours = [...buckets.keys()].sort((a, b) => a - b);
	const points: Chart24hPoint[] = sortedHours.map((hourMs) => {
		const b = buckets.get(hourMs)!;
		return {
			timeMs: hourMs,
			rpm: b.sum / b.n,
			label: formatTooltipLabel(hourMs),
			telemetryStatus: b.worst,
		};
	});

	if (points.length === 0) {
		return {
			points: [],
			axis: { domainStart: windowStart, domainEnd: domainEnd, ticks: [] },
		};
	}

	let domainStart = points[0].timeMs;
	let domainEndAxis = points[points.length - 1].timeMs;
	if (points.length === 1) {
		domainStart -= MS_30M;
		domainEndAxis += MS_30M;
	}

	const ticks = points.map((p) => p.timeMs);

	return {
		points,
		axis: { domainStart, domainEnd: domainEndAxis, ticks },
	};
}

export function format24hAxisTick(timeMs: number): string {
	return new Date(timeMs).toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}
