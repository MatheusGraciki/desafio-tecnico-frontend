import { Button } from "reactstrap";
import { AppCard } from "@/components/common/Card.tsx";
import type { StatusCardsProps } from "./type";
import "./styles.scss";

export function StatusCards({ items }: StatusCardsProps) {
	return (
		<div className="status-summary-cards">
			{items.map((item) => {
				const statusTextClass = `text-${item.textColor}`;

				return (
					<div key={item.key} className="status-summary-card-item">
						<AppCard
							cardStyle={{ width: "100%" }}
							titleAlign="center"
							contentStyle={{
								padding: "0.75rem 1rem",
							}}
							title={
								<div className={`status-summary-title ${statusTextClass} justify-content-center`}>
									{item.smallIcon}
									<span className="status-summary-label">{item.label}</span>
								</div>
							}
						>
							<div className="status-summary-content d-flex flex-column">
								<div className="status-summary-main d-flex justify-content-center align-items-center">
									<div className={`status-summary-icon ${statusTextClass}`}>{item.largeIcon}</div>
									<h4 className={`status-summary-count ${statusTextClass}`}>
										{item.count}
										<span className="status-summary-percentage">({item.percentage}%)</span>
									</h4>
								</div>
								<hr className="my-1" />
								<Button
									color={item.buttonColor}
									size="sm"
									className="align-self-center status-summary-button"
								>
									Detalhes
								</Button>
							</div>
						</AppCard>
					</div>
				);
			})}
		</div>
	);
}
