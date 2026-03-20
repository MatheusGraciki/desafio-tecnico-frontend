import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { Card, CardBody } from "reactstrap";

interface AppCardProps extends PropsWithChildren {
	title?: ReactNode;
	subtitle?: ReactNode;
	action?: ReactNode;
	cardStyle?: CSSProperties;
	contentStyle?: CSSProperties;
	titleAlign?: "start" | "center";
}

export function AppCard({
	title,
	subtitle,
	action,
	children,
	cardStyle,
	contentStyle,
	titleAlign = "start",
}: AppCardProps) {
	const titleContainerClassName = titleAlign === "center" ? "w-100" : undefined;
	const titleClassName = titleAlign === "center" ? "mb-0 lh-sm text-center" : "mb-0 lh-sm";
	const subtitleClassName =
		titleAlign === "center" ? "text-secondary lh-sm d-block text-center" : "text-secondary lh-sm";
	const subtitleNode = subtitle ? <small className={subtitleClassName}>{subtitle}</small> : null;

	return (
		<Card
			className="border"
			style={{ borderRadius: "0.5rem", height: "100%", width: "100%", ...cardStyle }}
		>
			<CardBody style={contentStyle}>
				{title || subtitle || action ? (
					<div className="d-flex justify-content-between align-items-start mb-2 gap-2">
						<div className={titleContainerClassName}>
							{title ? <h6 className={titleClassName}>{title}</h6> : null}
							{subtitleNode}
						</div>
						{action}
					</div>
				) : null}
				{children}
			</CardBody>
		</Card>
	);
}
