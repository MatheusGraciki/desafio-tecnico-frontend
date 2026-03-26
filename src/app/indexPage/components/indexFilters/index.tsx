import { FaIndustry } from "react-icons/fa6";
import { TiLocation } from "react-icons/ti";
import Select from "@/components/select";
import type { IndexFiltersProps } from "./type";
import "./styles.scss";

export function IndexFilters({
	selectedLocation,
	locations,
	onLocationChange,
	selectedMachineKind,
	machineKinds,
	onMachineKindChange,
}: IndexFiltersProps) {
	const locationOptions = [
		{ value: "all", label: "Local: Todos" },
		...locations
			.filter((location) => location !== "all")
			.map((location) => ({ value: location, label: `Local: ${location}` })),
	];

	const kindOptions = machineKinds.map((kind) =>
		kind === "all"
			? { value: "all", label: "Máquina: Todas" }
			: { value: kind, label: `Máquina: ${kind}` },
	);

	return (
		<div className="index-filters">
			<div className="index-filters-field index-filters-location">
				<Select
					value={selectedLocation}
					options={locationOptions}
					onChange={onLocationChange}
					ariaLabel="Selecionar local"
					icon={<TiLocation size={18} className="text-success" />}
				/>
			</div>

			<div className="index-filters-field index-filters-arrangement">
				<Select
					value={selectedMachineKind}
					options={kindOptions}
					onChange={onMachineKindChange}
					ariaLabel="Filtrar por tipo de máquina"
					icon={<FaIndustry size={16} className="text-success" />}
				/>
			</div>
		</div>
	);
}
