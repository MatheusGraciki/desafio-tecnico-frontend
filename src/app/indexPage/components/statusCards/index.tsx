import { Button } from "reactstrap";
import { Card } from "@/components/card";
import type { StatusCardsProps } from "./type";
import "./styles.scss";

export function StatusCards({ items, onDetailsClick }: StatusCardsProps) {
	return (
		<div className="status-summary-cards">
			{items.map((item) => {
				const statusTextClass = `text-${item.textColor}`;

				return (
					<div key={item.key} className="status-summary-card-item">
						<Card
							styles={{ width: "100%" }}
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
									{item.largeIcon ? (
										<div className={`status-summary-icon ${statusTextClass}`}>{item.largeIcon}</div>
									) : null}
									<h4 className={`status-summary-count ${statusTextClass}`}>
										{item.count}
										{item.percentage !== undefined ? (
											<span className="status-summary-percentage">({item?.percentage}%)</span>
										) : null}
										{item.countDetail ? (
											<span className="status-summary-percentage"> {item?.countDetail} </span>
										) : null}
									</h4>
								</div>
								<hr className="my-1" />
								<Button
									type="button"
									color={item.buttonColor}
									size="sm"
									className="align-self-center status-summary-button"
									onClick={() => onDetailsClick?.(item.key)}
								>
									Detalhes
								</Button>
							</div>
						</Card>
					</div>
				);
			})}
		</div>
	);
}
