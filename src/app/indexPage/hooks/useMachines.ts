import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError } from "@/helper/apiError";
import { fetchMachines } from "@/services/machines";
import type { Machine } from "@/services/machines/type";
import { isSameCalendarDay } from "../utils/date";
import {
	countMachinesByStatus,
	getStatusCategory,
	inferMachineKind,
} from "../utils/machine";
import type { MachineStatusCount } from "../utils/machine/type";

const MACHINES_PER_PAGE = 9;

export function useIndexMachines() {
	const [machines, setMachines] = useState<Machine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedLocation, setSelectedLocation] = useState("all");
	const [selectedMachineKind, setSelectedMachineKind] = useState("all");
	const [machinesPage, setMachinesPage] = useState(0);

	const loadMachines = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await fetchMachines();
			if (!Array.isArray(data)) {
				throw new ApiError(
					"Resposta inválida da API (esperado lista de máquinas).",
				);
			}
			setMachines(data);
		} catch (err) {
			setMachines([]);
			setError(
				err instanceof ApiError
					? err.message
					: "Não foi possível carregar as máquinas.",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		let active = true;

		async function syncMachines() {
			await loadMachines();
			if (!active) return;
		}

		void syncMachines();

		return () => {
			active = false;
		};
	}, [loadMachines]);

	const locations = useMemo(
		() => [
			"all",
			...new Set(
				machines
					.map((machine) => machine?.local)
					.filter((location): location is string => Boolean(location)),
			),
		],
		[machines],
	);

	const machineKinds = useMemo(() => {
		const kinds = new Set(
			machines.map((m) => inferMachineKind(m.codigo ?? "")),
		);
		return ["all", ...[...kinds].sort((a, b) => a.localeCompare(b, "pt-BR"))];
	}, [machines]);

	const filteredMachines = useMemo(() => {
		return machines.filter((machine) => {
			if (selectedLocation !== "all" && machine?.local !== selectedLocation) {
				return false;
			}
			if (selectedMachineKind !== "all") {
				const kind = inferMachineKind(machine.codigo ?? "");
				if (kind !== selectedMachineKind) return false;
			}
			return true;
		});
	}, [machines, selectedLocation, selectedMachineKind]);

	const totalMachinePages = Math.max(
		1,
		Math.ceil(filteredMachines.length / MACHINES_PER_PAGE),
	);

	const paginatedMachines = useMemo(
		() =>
			filteredMachines.slice(
				machinesPage * MACHINES_PER_PAGE,
				machinesPage * MACHINES_PER_PAGE + MACHINES_PER_PAGE,
			),
		[filteredMachines, machinesPage],
	);

	useEffect(() => {
		setMachinesPage(0);
	}, [selectedLocation, selectedMachineKind]);

	useEffect(() => {
		if (machinesPage > totalMachinePages - 1) {
			setMachinesPage(0);
		}
	}, [machinesPage, totalMachinePages]);

	const statusCounts = useMemo<MachineStatusCount>(
		() => countMachinesByStatus(filteredMachines),
		[filteredMachines],
	);

	const alertsEnteredToday = useMemo(
		() =>
			filteredMachines.filter(
				(machine) =>
					getStatusCategory(machine?.status) === "alerta" &&
					isSameCalendarDay(machine?.ultimaAtualizacao),
			).length,
		[filteredMachines],
	);

	const criticalMachines = useMemo(
		() =>
			filteredMachines.filter(
				(machine) => getStatusCategory(machine?.status) === "alerta",
			),
		[filteredMachines],
	);

	const warningMachines = useMemo(
		() =>
			filteredMachines.filter(
				(machine) => getStatusCategory(machine?.status) === "atencao",
			),
		[filteredMachines],
	);

	const mergeMachine = useCallback((updated: Machine) => {
		setMachines((prev) =>
			prev.map((machine) =>
				String(machine.id) === String(updated.id)
					? { ...machine, ...updated }
					: machine,
			),
		);
	}, []);

	return {
		error,
		loading,
		retryLoad: loadMachines,
		selectedLocation,
		setSelectedLocation,
		selectedMachineKind,
		setSelectedMachineKind,
		machineKinds,
		machinesPage,
		setMachinesPage,
		machinesPerPage: MACHINES_PER_PAGE,
		totalMachinePages,
		locations,
		filteredMachines,
		paginatedMachines,
		statusCounts,
		alertsEnteredToday,
		criticalMachines,
		warningMachines,
		mergeMachine,
	};
}
