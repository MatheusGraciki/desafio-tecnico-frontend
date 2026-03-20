import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { Card, CardBody } from "reactstrap";

interface AppCardProps extends PropsWithChildren {
	title?: ReactNode;
	subtitle?: ReactNode;
	action?: ReactNode;
	cardSx?: CSSProperties;
	contentSx?: CSSProperties;
}

export function AppCard({ title, subtitle, action, children, cardSx, contentSx }: AppCardProps) {
	return (
		<Card
			className="border"
			style={{ borderRadius: "0.5rem", height: "100%", width: "100%", ...cardSx }}
		>
			<CardBody style={contentSx}>
				{title || subtitle || action ? (
					<div className="d-flex justify-content-between align-items-start mb-2 gap-2">
						<div>
							{title ? <h6 className="mb-0 lh-sm">{title}</h6> : null}
							{subtitle ? <small className="text-secondary lh-sm">{subtitle}</small> : null}
						</div>
						{action}
					</div>
				) : null}
				{children}
			</CardBody>
		</Card>
	);
}
