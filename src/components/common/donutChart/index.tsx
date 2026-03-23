import { createPortal } from "react-dom";
import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Cell, Pie, PieChart } from "recharts";
import "./index.scss";

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

const TOOLTIP_MAX_WIDTH = 300;
const TOOLTIP_MIN_WIDTH = 240;
const VIEWPORT_PAD = 10;

type TooltipPlacement = {
	left: number;
	top: number;
	maxWidth: number;
	transform: string;
};

function computeTooltipPlacement(
	legendRect: DOMRect,
	tipRect: DOMRect | null,
	vw: number,
	vh: number,
): TooltipPlacement {
	const pad = VIEWPORT_PAD;
	const spaceRight = vw - legendRect.left - pad;
	const maxW = Math.min(
		TOOLTIP_MAX_WIDTH,
		vw - pad * 2,
		spaceRight,
		Math.max(180, legendRect.width),
	);

	const leftBase = legendRect.left;

	if (!tipRect) {
		return {
			left: leftBase,
			top: legendRect.top + legendRect.height / 2,
			maxWidth: maxW,
			transform: "translateY(-50%)",
		};
	}

	const w = tipRect.width;
	const h = tipRect.height;

	let top = legendRect.top + legendRect.height / 2 - h / 2;
	top = Math.min(vh - pad - h, Math.max(pad, top));

	let left = leftBase;
	left = Math.min(vw - pad - w, Math.max(pad, left));

	return {
		left,
		top,
		maxWidth: maxW,
		transform: "none",
	};
}

export function DonutChart({ data, renderTooltip, height = 220, title }: DonutChartProps) {
	const [activeItem, setActiveItem] = useState<DonutChartItem | null>(null);
	const [placement, setPlacement] = useState<TooltipPlacement | null>(null);

	const legendRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const total = useMemo(
		() => data.reduce((s, item) => s + (Number.isFinite(item.value) ? item.value : 0), 0),
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

	const updatePlacement = useCallback(() => {
		if (!activeItem || !renderTooltip) {
			setPlacement(null);
			return;
		}
		const legend = legendRef.current;
		if (!legend) {
			setPlacement(null);
			return;
		}
		const tipEl = tooltipRef.current;
		const tipRect = tipEl?.getBoundingClientRect() ?? null;
		setPlacement(
			computeTooltipPlacement(legend.getBoundingClientRect(), tipRect, window.innerWidth, window.innerHeight),
		);
	}, [activeItem, renderTooltip]);

	const setTooltipElement = useCallback(
		(el: HTMLDivElement | null) => {
			tooltipRef.current = el;
			if (el) {
				requestAnimationFrame(updatePlacement);
			}
		},
		[updatePlacement],
	);

	useLayoutEffect(() => {
		if (!activeItem || !renderTooltip) {
			setPlacement(null);
			return;
		}

		updatePlacement();
		const onViewport = () => updatePlacement();
		window.addEventListener("resize", onViewport);
		window.addEventListener("scroll", onViewport, true);
		const raf = requestAnimationFrame(() => updatePlacement());

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", onViewport);
			window.removeEventListener("scroll", onViewport, true);
		};
	}, [activeItem, renderTooltip, data, updatePlacement]);

	const tooltipPortal =
		activeItem && renderTooltip && placement ? (
			createPortal(
				<div
					ref={setTooltipElement}
					className="donut-chart-tooltip-portal"
					style={{
						position: "fixed",
						top: placement.top,
						left: placement.left,
						transform: placement.transform,
						zIndex: 1050,
						maxWidth: placement.maxWidth,
						width: "max-content",
						minWidth: Math.min(TOOLTIP_MIN_WIDTH, placement.maxWidth),
						pointerEvents: "none",
						boxSizing: "border-box",
					}}
				>
					{renderTooltip(activeItem, total)}
				</div>,
				document.body,
			)
		) : null;

	return (
		<div className="donut-chart" style={{ minHeight: height, position: "relative" }}>
			<div className="donut-chart-figure">
				{title ? <div className="donut-chart-title-text">{title}</div> : null}
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

			<div ref={legendRef} className="donut-chart-legend-wrap">
				<div className="donut-chart-legend">
					{legendItems}
					{total === 0 ? <small className="text-secondary">Sem dados para exibir.</small> : null}
				</div>
			</div>
			{tooltipPortal}
		</div>
	);
}
