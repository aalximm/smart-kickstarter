'use client';

import cn from 'classnames';
import {
	Card,
	CardProps,
	SemanticShorthandCollection,
} from 'semantic-ui-react';
import styles from './Campaigns.module.css';

export interface CampaignsProps {
	addresses: string[];
	className: string;
}

export const Campaigns = ({ addresses, className }: CampaignsProps) => {
	const items: SemanticShorthandCollection<CardProps> = addresses.map(
		(address): CardProps => {
			return {
				header: address,
				description: <a>View Campaign</a>,
				fluid: true,
				className: styles.card,
			};
		},
	) as any;

	return <Card.Group items={items} className={cn(className, styles.cards)} />;
};
