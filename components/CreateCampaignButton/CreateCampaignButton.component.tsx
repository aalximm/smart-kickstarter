'use client';

import { Button, SemanticShorthandContent } from 'semantic-ui-react';

export interface CreateCampaignButtonProps {
	content: SemanticShorthandContent;
	className: string;
}

export const CreateCampaignButton = ({
	content,
	className,
}: CreateCampaignButtonProps) => {
	return (
		<div className={className}>
			<Button
				content={content}
				icon="add circle"
				labelPosition="left"
				primary
				// floated="right"
			/>
		</div>
	);
};
