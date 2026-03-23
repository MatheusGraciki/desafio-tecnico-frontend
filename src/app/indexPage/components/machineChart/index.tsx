import { memo, useMemo, type ReactNode } from "react";
import { FaCircleQuestion } from "react-icons/fa6";
import { IoMdWater } from "react-icons/io";
import { PiQuestionThin } from "react-icons/pi";
import { DonutChart } from "@/components/common/donutChart";
import type { Machine } from "@/services/machines/type";
import type { MachineChartProps } from "./type";
import "./styles.scss";

const ALERT_SEVERITY = {
	"Desgaste de Ferramenta": "critical",
	"Temp. Alta": "critical",
	"Pico de Potência": "warning",
	"RPM Baixo": "warning",
	"Vibração Alta": "warning",
	"Inspeção Recomendada": "warning",
	"Manutenção Preventiva": "warning",
	"Parada Não Programada": "neutral",
	"Sem Telemetria": "neutral",
} as const;

type AlertSeverity = (typeof ALERT_SEVERITY)[keyof typeof ALERT_SEVERITY];
type ProcessedAlerts = {
	critical: Record<string, number>;
	warning: Record<string, number>;
	neutral: Record<string, number>;
	healthy: number;
};

type ChartGroup = {
	label: string;
	color: string;
	value: number;
	details: Record<string, number>;
	icon: ReactNode;
};

function normalizeAlert(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/\s+/g, " ");
}

const ALERT_SEVERITY_LOOKUP = Object.fromEntries(
	Object.entries(ALERT_SEVERITY).map(([label, severity]) => [normalizeAlert(label), severity]),
) as Record<string, AlertSeverity>;

function getAlertSeverity(alert: string): AlertSeverity | undefined {
	return ALERT_SEVERITY_LOOKUP[normalizeAlert(alert)];
}

function processAlerts(machines: Machine[]): ProcessedAlerts {
	const result: ProcessedAlerts = {
		critical: {},
		warning: {},
		neutral: {},
		healthy: 0,
	};

	machines.forEach((machine) => {
		if (!machine.alertas?.length) {
			result.healthy += 1;
			return;
		}

		machine.alertas.forEach((alert) => {
			const severity = getAlertSeverity(alert);
			if (!severity) return;

			const bucket = result[severity];
			bucket[alert] = (bucket[alert] || 0) + 1;
		});
	});

	return result;
}

function buildChartData(processed: ProcessedAlerts): ChartGroup[] {
	const sum = (obj: Record<string, number>) => Object.values(obj).reduce((a, b) => a + b, 0);

	return [
		{
			label: "Críticos",
			color: "#ef4444",
			value: sum(processed.critical),
			details: processed.critical,
			icon: <IoMdWater size={14} />,
		},
		{
			label: "Atenção",
			color: "#eab308",
			value: sum(processed.warning),
			details: processed.warning,
			icon: <IoMdWater size={14} />,
		},
		{
			label: "Saudável",
			color: "#22c55e",
			value: processed.healthy,
			details: { "Sem alertas": processed.healthy },
			icon: <FaCircleQuestion size={13} />,
		},
		{
			label: "Sem dados",
			color: "#94a3b8",
			value: sum(processed.neutral),
			details: processed.neutral,
			icon: <PiQuestionThin size={14} />,
		},
	];
}

function buildTooltip(group: ChartGroup, total: number) {
	const percentage = total ? ((group.value / total) * 100).toFixed(1) : "0.0";

	return (
		<div className="machine-chart-tooltip">
			<div className="machine-chart-tooltip-header">
				<span className="machine-chart-tooltip-dot" style={{ backgroundColor: group.color }} />
				<strong className="machine-chart-tooltip-title">{group.label}</strong>
				<span className="machine-chart-tooltip-percentage">{percentage}%</span>
			</div>

			<div className="machine-chart-tooltip-divider" />

			<div className="machine-chart-tooltip-list">
				{Object.entries(group.details).map(([name, value]) => {
					const p = total ? ((value / total) * 100).toFixed(1) : "0.0";

					return (
						<div key={name} className="machine-chart-tooltip-item">
							<span className="machine-chart-tooltip-name">{name}</span>
							<span className="machine-chart-tooltip-value">
								{p}% <span className="text-muted">({value})</span>
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export const MachineChart = memo(function MachineChart({ machines }: MachineChartProps) {
	const chartData = useMemo(
		() =>
			buildChartData(processAlerts(machines)).map((group) => ({
				name: group.label,
				value: group.value,
				fill: group.color,
				icon: group.icon,
				details: group.details,
			})),
		[machines],
	);

	if (!chartData.length) {
		return (
			<div style={{ paddingBlock: 8 }}>
				<small className="text-secondary">Sem alertas para exibir no gráfico.</small>
			</div>
		);
	}

	return (
		<div className="machine-chart">
			<DonutChart
				title="Resumo dos Alertas"
				data={chartData}
				renderTooltip={(item, totalCount) =>
					buildTooltip(
						{
							label: item.name,
							color: item.fill,
							value: item.value,
							details: item.details || { [item.name]: item.value },
							icon: item.icon ?? <FaCircleQuestion size={13} />,
						},
						totalCount,
					)
				}
				height={220}
			/>
		</div>
	);
});
