import { FaBolt, FaClock } from "react-icons/fa6";
import type { AnalysisSidebarTab } from "../type";
import "./styles.scss";

type AnalysisSidebarTabsProps = {
	tab: AnalysisSidebarTab;
	onTabChange: (tab: AnalysisSidebarTab) => void;
};

export function Tabs({ tab, onTabChange }: AnalysisSidebarTabsProps) {
	return (
		<div className="sidebar-tabs" role="tablist">
			<button
				type="button"
				role="tab"
				aria-selected={tab === "analise"}
				className={`sidebar-tabs-tab ${tab === "analise" ? "is-active" : ""}`}
				onClick={() => onTabChange("analise")}
			>
				<FaBolt
					className={`sidebar-tabs-icon ${tab === "analise" ? "" : "text-secondary opacity-75"}`}
					size={12}
					aria-hidden
				/>
				Análise
			</button>
			<button
				type="button"
				role="tab"
				aria-selected={tab === "previsoes"}
				className={`sidebar-tabs-tab ${tab === "previsoes" ? "is-active" : ""}`}
				onClick={() => onTabChange("previsoes")}
			>
				<FaClock
					className={`sidebar-tabs-icon ${tab === "previsoes" ? "" : "text-secondary opacity-75"}`}
					size={12}
					aria-hidden
				/>
				Previsões
			</button>
		</div>
	);
}
