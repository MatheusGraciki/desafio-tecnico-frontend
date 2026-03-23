import { useMemo } from "react";
import { FaBell, FaCircleExclamation, FaRegCircleCheck } from "react-icons/fa6";
import { Alert, Col, Row } from "reactstrap";
import { LuClock12, LuClock4 } from "react-icons/lu";

import { AnalysisSidebar } from "./components/analysisSidebar";
import { IndexFilters } from "./components/indexFilters";
import { StatusDistribution } from "./components/statusDistribution";
import { MachineCard } from "./components/machineCard";
import { StatusCards } from "./components/statusCards";
import { useIndexMachines } from "./hooks/useMachines";
import "./styles.scss";

import type { MachineStatusCategory } from "@/services/machines/type";
import type { SummaryItem } from "./type";

const SUMMARY_META: Record<
	MachineStatusCategory,
	Pick<SummaryItem, "label" | "textColor" | "buttonColor" | "smallIcon" | "largeIcon">
> = {
	operando: {
		label: "Em Operação",
		textColor: "success",
		buttonColor: "success",
		smallIcon: null,
		largeIcon: <FaRegCircleCheck size={30} />,
	},
	alerta: {
		label: "Em Alerta",
		textColor: "danger",
		buttonColor: "danger",
		smallIcon: null,
		largeIcon: <FaBell size={28} />,
	},
	atencao: {
		label: "Em Atenção",
		textColor: "warning",
		buttonColor: "warning",
		smallIcon: null,
		largeIcon: <FaCircleExclamation size={28} />,
	},
	parada: {
		label: "Parada ou Offline",
		textColor: "secondary",
		buttonColor: "secondary",
		smallIcon: <LuClock12 size={16} />,
		largeIcon: <LuClock4 size={30} />,
	},
};

function DashboardSkeleton() {
	return (
		<div className="index-page-skeleton">
			<div className="index-page-skeleton-top">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className="bg-body-secondary rounded index-page-skeleton-card" />
				))}
			</div>
			<div className="index-page-skeleton-bottom">
				<div className="bg-body-secondary rounded index-page-skeleton-main" />
				<div className="bg-body-secondary rounded index-page-skeleton-side" />
			</div>
		</div>
	);
}

export default function IndexPage() {
	const {
		loading,
		error,
		selectedLocation,
		setSelectedLocation,
		machinesPage,
		setMachinesPage,
		machinesPerPage,
		totalMachinePages,
		locations,
		filteredMachines,
		paginatedMachines,
		statusCounts,
		alertsEnteredToday,
		criticalMachines,
		warningMachines,
	} = useIndexMachines();

	const summaryItems = useMemo<SummaryItem[]>(() => {
		const total = filteredMachines.length || 1;

		return (Object.keys(SUMMARY_META) as MachineStatusCategory[]).map((key) => ({
			key,
			label: SUMMARY_META[key].label,
			count: statusCounts[key],
			percentage: key === "operando" ? Math.round((statusCounts[key] / total) * 100) : undefined,
			countDetail: key === "alerta" ? `(+${alertsEnteredToday} hoje)` : undefined,
			textColor: SUMMARY_META[key].textColor,
			buttonColor: SUMMARY_META[key].buttonColor,
			smallIcon: SUMMARY_META[key].smallIcon,
			largeIcon: SUMMARY_META[key].largeIcon,
		}));
	}, [alertsEnteredToday, filteredMachines, statusCounts]);

	function handlePreviousPage() {
		setMachinesPage((value) => (value === 0 ? totalMachinePages - 1 : value - 1));
	}

	function handleNextPage() {
		setMachinesPage((value) => (value === totalMachinePages - 1 ? 0 : value + 1));
	}

	return (
		<div className="index-page d-flex flex-column px-2 px-md-3 px-lg-4">
			<h1 className="h4 fw-bold mb-0">Visão Geral</h1>

			{error ? <Alert color="danger">{error}</Alert> : null}

			{loading ? (
				<DashboardSkeleton />
			) : (
				<>
					<Row className="g-3 align-items-start">
						<Col xs={12} md={8} xxl={9} className="index-main-col">
							<Row className="g-3">
								<IndexFilters
									selectedLocation={selectedLocation}
									locations={locations}
									onLocationChange={setSelectedLocation}
								/>
							</Row>

							<div className="index-summary-wrapper">
								<StatusCards items={summaryItems} />
							</div>

							<div className="index-distribution">
								<div className="index-distribution-header d-flex align-items-center">
									<h2 className="h6 mb-0">Distribuição de Status</h2>
									<div className="index-distribution-separator" aria-hidden="true" />

									{filteredMachines.length > machinesPerPage ? (
										<StatusDistribution
											currentPage={machinesPage}
											totalPages={totalMachinePages}
											onPrevious={handlePreviousPage}
											onNext={handleNextPage}
											onSelectPage={setMachinesPage}
										/>
									) : null}
								</div>
								<div className="index-machine-grid">
									{paginatedMachines.map((machine) => (
										<MachineCard key={machine.id} machine={machine} />
									))}
								</div>
							</div>
						</Col>

						<Col xs={12} md={4} xxl={3} className="index-side-col">
							<AnalysisSidebar
								criticalMachines={criticalMachines}
								warningMachines={warningMachines}
								machines={filteredMachines}
							/>
						</Col>
					</Row>
				</>
			)}
		</div>
	);
}
