import { useEffect, useMemo, useState } from "react";

import type { Machine, MachineData } from "@/services/machines/type";
import {
	getLastMachineData,
	getMachineImageUrl,
	getStatusInfo,
	getMachineAlertaLabels,
	hasTemperaturaAltaAlert,
} from "@/app/indexPage/utils/machine";
import { build24hChartSeries } from "../utils/chart24h";
import { computeKpisFromDados, getTelemetryStatus } from "../utils/kpiFromDados";

export type MainTab = "resumo" | "historico" | "estatisticas" | "alertas";
export type RangeKey = "24h" | "7d" | "30d";

const RANGE_WINDOW: Record<RangeKey, number> = {
	"24h": 24,
	"7d": 48,
	"30d": 96,
};

const MIN_SAMPLES_FOR_RANGE: Record<RangeKey, number> = {
	"24h": 1,
	"7d": 48,
	"30d": 96,
};

function formatChartLabel(timestamp: string) {
	const date = new Date(timestamp);
	if (Number.isNaN(date.getTime())) return "";

	return date.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getTemperaturaSparkSeries(data: MachineData[], maxPoints = 24) {
	return data.slice(-maxPoints).map((item) => item.temperatura);
}

function getStatusDotClass(category?: string | null) {
	if (category === "operando") return "text-success";
	if (category === "alerta") return "text-danger";
	if (category === "atencao") return "text-warning";
	return "text-secondary";
}

export function useMachineDetail(machine: Machine | null) {
	// navegação da tela
	const [mainTab, setMainTab] = useState<MainTab>("resumo");
	const [range, setRange] = useState<RangeKey>("24h");
	const [windowStart, setWindowStart] = useState(0);

	// dados base da máquina
	const machineData = machine?.dados ?? [];
	const lastData = machine ? getLastMachineData(machine) : undefined;
	const statusInfo = machine ? getStatusInfo(machine.status) : null;
	const imageUrl = machine ? getMachineImageUrl(machine.codigo) : "";
	const alertaLabels = useMemo(
		() => (machine ? getMachineAlertaLabels(machine) : []),
		[machine],
	);
	const temperaturaAlertaAtiva = useMemo(
		() => (machine ? hasTemperaturaAltaAlert(machine) : false),
		[machine],
	);
	const showTempBadge = alertaLabels.length > 0;

	useEffect(() => {
		setMainTab("resumo");
	}, [machine?.id]);

	useEffect(() => {
		setWindowStart(0);
	}, [machine?.id, range]);

	// regras de range
	const windowSize = RANGE_WINDOW[range];
	const maxStart = Math.max(0, machineData.length - windowSize);
	const hasEnoughSamplesForRange =
		machineData.length >= MIN_SAMPLES_FOR_RANGE[range];

	useEffect(() => {
		setWindowStart((current) => Math.min(current, maxStart));
	}, [maxStart]);

	useEffect(() => {
		if (range !== "24h" && !hasEnoughSamplesForRange) {
			setRange("24h");
		}
	}, [range, hasEnoughSamplesForRange]);

	const rangeDisabled = (key: RangeKey) =>
		key !== "24h" && machineData.length < MIN_SAMPLES_FOR_RANGE[key];

	// dados para gráfico
	const temperaturaSpark = useMemo(
		() => getTemperaturaSparkSeries(machineData),
		[machineData],
	);

	const chartSlice = useMemo(() => {
		if (!hasEnoughSamplesForRange) return [];

		const start = Math.min(windowStart, maxStart);
		return machineData.slice(start, start + windowSize);
	}, [hasEnoughSamplesForRange, machineData, maxStart, windowSize, windowStart]);

	const chart24hSeries = useMemo(() => {
		if (range !== "24h" || !hasEnoughSamplesForRange || !machineData.length) {
			return null;
		}

		return build24hChartSeries(machineData);
	}, [range, hasEnoughSamplesForRange, machineData]);

	const chartData = useMemo(() => {
		if (range === "24h") {
			return (
				chart24hSeries?.points.map((point) => ({
					label: point.label,
					rpm: point.rpm,
					timeMs: point.timeMs,
					telemetryStatus: point.telemetryStatus,
				})) ?? []
			);
		}

		return chartSlice.map((item) => ({
			label: formatChartLabel(item.timestamp),
			rpm: item.rpm,
			timeMs: new Date(item.timestamp).getTime(),
			telemetryStatus: getTelemetryStatus(item),
		}));
	}, [range, chart24hSeries, chartSlice]);

	// indicadores
	const computedKpis = useMemo(
		() => computeKpisFromDados(machineData),
		[machineData],
	);

	const kpis = {
		alerta: computedKpis.alerta,
		atencao: computedKpis.atencao,
		totalOper: computedKpis.totalOper,
	};

	const efficiency = computedKpis.efficiency;
	const efficiencyClass = computedKpis.efficiencyClass;

	// apresentação
	const statusDotClass = getStatusDotClass(statusInfo?.category);

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
		alertaLabels,
		temperaturaAlertaAtiva,
		dados: machineData,

		chartData,
		chart24hAxis: range === "24h" ? chart24hSeries?.axis ?? null : null,
		temperaturaSpark,
		hasEnoughSamplesForRange,
		rangeDisabled,

		kpis,
		efficiency,
		efficiencyClass,
		statusDotClass,
	};
}
