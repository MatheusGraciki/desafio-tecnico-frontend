import { useMemo } from "react";
import type ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import type { Chart24hAxis } from "./utils/chart24h";
import { type TelemetryStatus } from "./utils/kpiFromDados";

export type MachineChartPoint = {
	label: string;
	rpm: number;
	timeMs?: number;
	telemetryStatus?: TelemetryStatus;
};

const FALLBACK_STATUS: TelemetryStatus = "operando";

const STROKE = {
	alerta: "#dc3545",
	atencao: "#ffc107",
	operando: "#22c55e",
	parada: "#6c757d",
} as const;

const STATUS_LABEL: Record<TelemetryStatus, string> = {
	alerta: "Alerta",
	atencao: "Atenção",
	operando: "Operando",
	parada: "Parada",
};

type SegRow = {
	x: number;
	label: string;
	rpmAlerta: number | null;
	rpmAtencao: number | null;
	rpmOperando: number | null;
	rpmParada: number | null;
};

function seriesForStatus(
	status: TelemetryStatus,
	rpm: number,
): Pick<SegRow, "rpmAlerta" | "rpmAtencao" | "rpmOperando" | "rpmParada"> {
	return {
		rpmAlerta: status === "alerta" ? rpm : null,
		rpmAtencao: status === "atencao" ? rpm : null,
		rpmOperando: status === "operando" ? rpm : null,
		rpmParada: status === "parada" ? rpm : null,
	};
}

function buildSegmentedRows(points: MachineChartPoint[]): SegRow[] {
	const out: SegRow[] = [];

	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		const timeMs = p.timeMs;
		if (timeMs == null || Number.isNaN(timeMs)) continue;

		const s = p.telemetryStatus ?? FALLBACK_STATUS;
		const prevS =
			i > 0 ? (points[i - 1].telemetryStatus ?? FALLBACK_STATUS) : null;

		const base = { x: timeMs, label: p.label };

		if (i > 0 && prevS !== null && prevS !== s) {
			const r = p.rpm;
			out.push({ ...base, ...seriesForStatus(prevS, r) });
			out.push({ ...base, ...seriesForStatus(s, r) });
		} else {
			out.push({ ...base, ...seriesForStatus(s, p.rpm) });
		}
	}

	return out;
}

function RpmLegend() {
	const order: TelemetryStatus[] = ["operando", "atencao", "alerta", "parada"];
	return (
		<div className="d-flex flex-wrap gap-3 justify-content-center small text-body-secondary mt-1">
			{order.map((key) => (
				<span key={key} className="d-inline-flex align-items-center gap-1">
					<span
						className="d-inline-block rounded-circle flex-shrink-0"
						style={{
							width: 8,
							height: 8,
							backgroundColor: STROKE[key],
						}}
						aria-hidden
					/>
					{STATUS_LABEL[key]}
				</span>
			))}
		</div>
	);
}

interface MachineChartProps {
	chartData: MachineChartPoint[];
	chart24hAxis?: Chart24hAxis | null;
}

const CHART_HEIGHT = 220;

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export function MachineChart({ chartData, chart24hAxis }: MachineChartProps) {
	const { series, options, hasData } = useMemo(() => {
		const pts = chartData.filter(
			(p): p is MachineChartPoint & { timeMs: number } =>
				typeof p.timeMs === "number" && !Number.isNaN(p.timeMs),
		);

		if (pts.length === 0) {
			return {
				series: [] as ApexCharts.ApexAxisChartSeries,
				options: {} as ApexCharts.ApexOptions,
				hasData: false,
			};
		}

		const rows = buildSegmentedRows(pts);
		const times = pts.map((p) => p.timeMs);
		const xMin = chart24hAxis?.domainStart ?? Math.min(...times);
		const xMax = chart24hAxis?.domainEnd ?? Math.max(...times);

		const ser = [
			{
				name: STATUS_LABEL.operando,
				data: rows.map((r) => [r.x, r.rpmOperando] as [number, number | null]),
			},
			{
				name: STATUS_LABEL.atencao,
				data: rows.map((r) => [r.x, r.rpmAtencao] as [number, number | null]),
			},
			{
				name: STATUS_LABEL.alerta,
				data: rows.map((r) => [r.x, r.rpmAlerta] as [number, number | null]),
			},
			{
				name: STATUS_LABEL.parada,
				data: rows.map((r) => [r.x, r.rpmParada] as [number, number | null]),
			},
		];

		const labelByTs = new Map(rows.map((r) => [r.x, r.label]));

		const opts: ApexCharts.ApexOptions = {
			chart: {
				type: "area",
				toolbar: { show: false },
				zoom: { enabled: false },
				animations: { enabled: false },
				fontFamily: "inherit",
			},
			colors: [STROKE.operando, STROKE.atencao, STROKE.alerta, STROKE.parada],
			stroke: {
				curve: "smooth",
				width: 2,
			},
			fill: {
				type: "gradient",
				gradient: {
					shadeIntensity: 0.35,
					opacityFrom: 0.45,
					opacityTo: 0.04,
					stops: [0, 92, 100],
				},
			},
			dataLabels: { enabled: false },
			markers: {
				size: 0,
				hover: { size: 0 },
			},
			legend: { show: false },
			grid: {
				borderColor: "rgba(0,0,0,0.08)",
				strokeDashArray: 4,
				xaxis: { lines: { show: true } },
				yaxis: { lines: { show: true } },
			},
			xaxis: {
				type: "datetime",
				min: xMin,
				max: xMax,
				tooltip: { enabled: false },
				labels: {
					datetimeUTC: false,
					style: { fontSize: "10px" },
				},
			},
			yaxis: {
				labels: {
					style: { fontSize: "10px" },
					formatter: (val: number) =>
						new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(val),
				},
			},
			annotations: {
				yaxis: [
					{
						y: 6000,
						borderColor: STROKE.alerta,
						borderWidth: 1,
						strokeDashArray: 5,
						opacity: 0.85,
					},
				],
			},
			tooltip: {
				shared: false,
				custom: ({ seriesIndex, dataPointIndex }) => {
					const row = rows[dataPointIndex];
					if (!row) return "";
					const keys: TelemetryStatus[] = ["operando", "atencao", "alerta", "parada"];
					const status = keys[seriesIndex];
					const v =
						status === "operando"
							? row.rpmOperando
							: status === "atencao"
								? row.rpmAtencao
								: status === "alerta"
									? row.rpmAlerta
									: row.rpmParada;
					if (v == null) return "";
					const label = escapeHtml(labelByTs.get(row.x) ?? "");
					const body = `${new Intl.NumberFormat("pt-BR").format(v)} rpm · ${STATUS_LABEL[status]}`;
					return (
						'<div style="padding:0;font-family:inherit">' +
						`<div style="padding:4px 8px;font-size:12px;font-weight:600;border-bottom:1px solid rgba(0,0,0,0.08)">${label}</div>` +
						`<div style="padding:6px 8px;font-size:12px">${escapeHtml(body)}</div>` +
						"</div>"
					);
				},
			},
		};

		return { series: ser, options: opts, hasData: true };
	}, [chartData, chart24hAxis]);

	if (!chartData.length || !hasData) {
		return null;
	}

	return (
		<div className="machine-detail-modal-chart-rpm">
			<div className="machine-detail-modal-chart-rpm-title">RPM</div>
			<div className="machine-detail-modal-chart-rpm-area">
				<ReactApexChart
					options={options}
					series={series}
					type="area"
					height={CHART_HEIGHT}
					width="100%"
				/>
			</div>
			<RpmLegend />
		</div>
	);
}
