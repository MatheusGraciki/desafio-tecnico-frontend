import { useMemo, useState } from "react";

import type { Machine } from "@/services/machines/type";
import { inferMachineKind } from "../utils/machine";

export function useMachineFilters(machines: Machine[]) {
	const [selectedLocation, setSelectedLocation] = useState("all");
	const [selectedMachineKind, setSelectedMachineKind] = useState("all");

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

	return {
		selectedLocation,
		setSelectedLocation,
		selectedMachineKind,
		setSelectedMachineKind,
		locations,
		machineKinds,
		filteredMachines,
	};
}
