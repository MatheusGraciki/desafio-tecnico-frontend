import { useMemo, useState } from "react";
import { FaCircleExclamation, FaRegCircleCheck } from "react-icons/fa6";
import { Alert, Col, Row } from "reactstrap";
import { LuClock12, LuClock4 } from "react-icons/lu";

import { AnalysisSidebar } from "./components/analysisSidebar";
import { MachineDetailModal } from "./components/machineDetailModal";
import { IndexFilters } from "./components/indexFilters";
import { StatusDistribution } from "./components/statusDistribution";
import { MachineCard } from "./components/machineCard";
import { StatusCards } from "./components/statusCards";
import { useIndexMachines } from "./hooks/useMachines";
import "./styles.scss";

import type { Machine, MachineStatusCategory } from "@/services/machines/type";
import type { SummaryItem } from "./type";
import { MdOutlineCrisisAlert } from "react-icons/md";

const STATUS_CONFIG: Record<
	MachineStatusCategory,
	Pick<
		SummaryItem,
		"label" | "textColor" | "buttonColor" | "smallIcon" | "largeIcon"
	>
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
		smallIcon: <MdOutlineCrisisAlert size={16} />,
		largeIcon: null,
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
					<div
						key={index}
						className="bg-body-secondary rounded index-page-skeleton-card"
					/>
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
	const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

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

		return (Object.keys(STATUS_CONFIG) as MachineStatusCategory[]).map(
			(status) => {
				const config = STATUS_CONFIG[status];
				const count = statusCounts[status];

				const isOperando = status === "operando";
				const isAlerta = status === "alerta";

				return {
					key: status,
					...config,
					count,
					percentage: isOperando
						? Math.round((count / total) * 100)
						: undefined,
					countDetail: isAlerta ? `(+${alertsEnteredToday} hoje)` : undefined,
				};
			},
		);
	}, [alertsEnteredToday, filteredMachines.length, statusCounts]);

	function handlePreviousPage() {
		setMachinesPage((currentPage) => {
			const isFirstPage = currentPage === 0;

			if (isFirstPage) {
				return totalMachinePages - 1;
			}

			return currentPage - 1;
		});
	}

	function handleNextPage() {
		setMachinesPage((currentPage) => {
			const isLastPage = currentPage === totalMachinePages - 1;

			if (isLastPage) {
				return 0;
			}

			return currentPage + 1;
		});
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
									<div
										className="index-distribution-separator"
										aria-hidden="true"
									/>

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
										<MachineCard
											key={machine.id}
											machine={machine}
											onSelect={setSelectedMachine}
										/>
									))}
								</div>
							</div>
						</Col>

						<Col xs={12} md={4} xxl={3}>
							<AnalysisSidebar
								criticalMachines={criticalMachines}
								warningMachines={warningMachines}
								machines={filteredMachines}
								onMachineSelect={setSelectedMachine}
							/>
						</Col>
					</Row>
				</>
			)}

			<MachineDetailModal
				machine={selectedMachine}
				isOpen={Boolean(selectedMachine)}
				onClose={() => setSelectedMachine(null)}
			/>
		</div>
	);
}
