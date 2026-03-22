import { useMemo, useState, type ReactNode } from "react";
import { Cell, Pie, PieChart } from "recharts";
import "./donutChart.scss";

export interface DonutChartItem {
	name: string;
	value: number;
	fill: string;
	icon?: ReactNode;
	details?: Record<string, number>;
}

interface DonutChartProps {
	data: DonutChartItem[];
	renderTooltip?: (item: DonutChartItem, total: number) => ReactNode;
	height?: number;
	title?: string;
}

export function DonutChart({ data, renderTooltip, height = 220, title }: DonutChartProps) {
	const [activeItem, setActiveItem] = useState<DonutChartItem | null>(null);
	const total = useMemo(
		() =>
			data.reduce((sum, item) => {
				const value = Number.isFinite(item.value) ? item.value : 0;
				return sum + value;
			}, 0),
		[data],
	);

	const legendItems = useMemo(
		() =>
			data.map((item) => (
				<div key={item.name} className="donut-chart-legend-item">
					<div className="donut-chart-legend-label">
						{item.icon ? (
							<span className="donut-chart-legend-icon" style={{ color: item.fill }}>
								{item.icon}
							</span>
						) : null}
						<span className="donut-chart-legend-name">{item.name}</span>
					</div>
					<div className="donut-chart-legend-value">{item.value}</div>
				</div>
			)),
		[data],
	);

	return (
		<div className="donut-chart" style={{ minHeight: height, position: "relative" }}>
			<div className="donut-chart-figure">
				{title && <div className="donut-chart-title-text">{title}</div>}
				<PieChart style={{ width: "100%", height, aspectRatio: 1 }}>
					<Pie
						data={data}
						dataKey="value"
						nameKey="name"
						innerRadius="62%"
						outerRadius="88%"
						paddingAngle={3}
						stroke="transparent"
						isAnimationActive={false}
						onMouseEnter={(_, index) => setActiveItem(data[index] ?? null)}
						onMouseLeave={() => setActiveItem(null)}
					>
						{data.map((entry) => (
							<Cell key={entry.name} fill={entry.fill} />
						))}
					</Pie>
				</PieChart>
			</div>

			<div className="donut-chart-legend">
				{activeItem && renderTooltip ? (
					<div className="donut-chart-tooltip-overlay">{renderTooltip(activeItem, total)}</div>
				) : null}
				{legendItems}
				{total === 0 ? <small className="text-secondary">Sem dados para exibir.</small> : null}
			</div>
		</div>
	);
}
