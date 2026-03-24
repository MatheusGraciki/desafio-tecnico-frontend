import { useEffect, useMemo, useState } from "react";
import type { Machine, MachineData } from "@/services/machines/type";
import {
	getLastMachineData,
	getMachineImageUrl,
	getStatusInfo,
} from "@/app/indexPage/utils/machine";
import { computeKpisFromDados } from "../utils/kpiFromDados";

export type MainTab = "resumo" | "historico" | "estatisticas" | "alertas";
export type RangeKey = "24h" | "7d" | "30d";

const RANGE_WINDOW: Record<RangeKey, number> = {
	"24h": 24,
	"7d": 48,
	"30d": 96,
};

/** Mínimo de pontos na série para permitir o período (7d/30d sem dados suficientes → não exibe gráfico). */
const MIN_SAMPLES_FOR_RANGE: Record<RangeKey, number> = {
	"24h": 1,
	"7d": 48,
	"30d": 96,
};

function formatChartLabel(iso: string) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function hasTemperaturaAltaAlert(machine: Machine): boolean {
	return (
		machine.alertas?.some((a) => {
			const s = a.toLowerCase();
			const falaDeTemp =
				s.includes("temperatura") ||
				s.includes("temp.") ||
				/\btemp\b/.test(s) ||
				s.includes("°c");
			const indicaAlta =
				s.includes("alta") ||
				s.includes("alto") ||
				s.includes("elev") ||
				s.includes("superaquec") ||
				s.includes("crít") ||
				s.includes("crit");
			return falaDeTemp && indicaAlta;
		}) ?? false
	);
}

function temperaturaSparkSeries(dados: MachineData[], maxPoints = 24) {
	if (!dados.length) return [];
	return dados.slice(-maxPoints).map((d) => d.temperatura);
}

export function useMachineDetail(machine: Machine | null) {
	const [mainTab, setMainTab] = useState<MainTab>("resumo");
	const [range, setRange] = useState<RangeKey>("24h");
	const [windowStart, setWindowStart] = useState(0);

	const lastData = machine ? getLastMachineData(machine) : undefined;
	const statusInfo = machine ? getStatusInfo(machine.status) : null;
	const imageUrl = machine ? getMachineImageUrl(machine.codigo) : "";
	const showTempBadge = machine ? hasTemperaturaAltaAlert(machine) : false;
	const dados = machine?.dados?.length ? machine.dados : [];

	const temperaturaSpark = useMemo(() => temperaturaSparkSeries(dados), [dados]);

	useEffect(() => {
		setMainTab("resumo");
	}, [machine?.id]);

	useEffect(() => {
		setWindowStart(0);
	}, [machine?.id, range]);

	const windowSize = RANGE_WINDOW[range];
	const maxStart = Math.max(0, dados.length - windowSize);

	const hasEnoughSamplesForRange = dados.length >= MIN_SAMPLES_FOR_RANGE[range];

	useEffect(() => {
		setWindowStart((s) => Math.min(s, maxStart));
	}, [maxStart]);

	useEffect(() => {
		if (range === "7d" && dados.length < MIN_SAMPLES_FOR_RANGE["7d"]) {
			setRange("24h");
		}
		if (range === "30d" && dados.length < MIN_SAMPLES_FOR_RANGE["30d"]) {
			setRange("24h");
		}
	}, [dados.length, range]);

	const chartSlice = useMemo(() => {
		if (!dados.length || !hasEnoughSamplesForRange) return [];
		const start = Math.min(windowStart, maxStart);
		return dados.slice(start, start + windowSize);
	}, [dados, hasEnoughSamplesForRange, maxStart, windowSize, windowStart]);

	const chartData = useMemo(
		() =>
			chartSlice.map((d) => ({
				label: formatChartLabel(d.timestamp),
				rpm: d.rpm,
			})),
		[chartSlice],
	);

	const kpiBlock = useMemo(() => computeKpisFromDados(dados), [dados]);
	const kpis = useMemo(
		() => ({
			alerta: kpiBlock.alerta,
			atencao: kpiBlock.atencao,
			totalOper: kpiBlock.totalOper,
		}),
		[kpiBlock],
	);
	const efficiency = kpiBlock.efficiency;
	const efficiencyClass = kpiBlock.efficiencyClass;

	const statusDotClass =
		statusInfo?.category === "operando"
			? "text-success"
			: statusInfo?.category === "alerta"
				? "text-danger"
				: statusInfo?.category === "atencao"
					? "text-warning"
					: "text-secondary";

	const rangeDisabled = (key: RangeKey) => {
		if (key === "24h") return false;
		return dados.length < MIN_SAMPLES_FOR_RANGE[key];
	};

	return {
		mainTab,
		setMainTab,
		range,
		setRange,
		windowStart,
		setWindowStart,
		windowSize,
		maxStart,
		lastData,
		statusInfo,
		imageUrl,
		showTempBadge,
		dados,
		chartData,
		temperaturaSpark,
		hasEnoughSamplesForRange,
		rangeDisabled,
		kpis,
		efficiency,
		efficiencyClass,
		statusDotClass,
	};
}
