import type { MachineStatusCategory } from "@/services/machines/type";
import type { StatusCardItem } from "./components/statusCards/type";

export interface SummaryItem extends StatusCardItem {
	key: MachineStatusCategory;
}
