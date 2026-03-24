import { FaChartBar } from "react-icons/fa6";
import type { AnalysisSidebarTab } from "../type";
import "./styles.scss";
import { LuChartColumnBig } from "react-icons/lu";

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
				className={`sidebar-tabs-tab ${tab === "analise" ? "is-active" : ""}`}
				onClick={() => onTabChange("analise")}
			>
				<LuChartColumnBig
					className={`sidebar-tabs-icon ${tab === "analise" ? "" : "text-secondary opacity-75"}`}
					size={20}
				/>
				Análise
			</button>
			<button
				type="button"
				role="tab"
				className={`sidebar-tabs-tab ${tab === "previsoes" ? "is-active" : ""}`}
				onClick={() => onTabChange("previsoes")}
			>
				<FaChartBar
					className={`sidebar-tabs-icon ${tab === "previsoes" ? "" : "text-secondary opacity-75"}`}
					size={18}
				/>
				Previsões
			</button>
		</div>
	);
}
