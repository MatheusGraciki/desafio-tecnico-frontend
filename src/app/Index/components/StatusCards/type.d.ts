import type { ReactNode } from "react";

export interface StatusCardItem {
	key: string;
	label: string;
	count: number;
	percentage: number;
	textColor: string;
	buttonColor: "success" | "danger" | "warning" | "info" | "secondary";
	smallIcon: ReactNode;
	largeIcon: ReactNode;
}

export interface StatusCardsProps {
	items: SummaryCardItem[];
}
