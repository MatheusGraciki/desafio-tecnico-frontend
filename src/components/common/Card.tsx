import type { PropsWithChildren, ReactNode } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";

interface AppCardProps extends PropsWithChildren {
	title?: ReactNode;
	subtitle?: ReactNode;
	action?: ReactNode;
	contentSx?: object;
}

export function AppCard({ title, subtitle, action, children, contentSx }: AppCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 2, height: "100%", width: "100%" }}>
			<CardContent sx={contentSx}>
				{title || subtitle || action ? (
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="flex-start"
						spacing={1}
						mb={1}
					>
						<Stack spacing={0}>
							{title ? (
								<Typography variant="h6" lineHeight={1.2}>
									{title}
								</Typography>
							) : null}
							{subtitle ? (
								<Typography variant="body2" color="text.secondary" lineHeight={1.2}>
									{subtitle}
								</Typography>
							) : null}
						</Stack>
						{action}
					</Stack>
				) : null}
				{children}
			</CardContent>
		</Card>
	);
}
