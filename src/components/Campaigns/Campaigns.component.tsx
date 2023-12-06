'use client';

import {
	Button,
	Card,
	CardProps,
	SemanticShorthandCollection,
} from 'semantic-ui-react';
import Link from 'next/link';
import { CAMPAIGN_INFO_PATH, CREATE_CAMPAIGN_PATH } from '@/constant/paths';
import styles from './Campaigns.module.css';

export interface CampaignsProps {
	addresses: string[];
}

export const Campaigns = ({ addresses }: CampaignsProps) => {
	const items: SemanticShorthandCollection<CardProps> = addresses.map(
		(address): CardProps => {
			return {
				header: address,
				description: (
					<Link href={CAMPAIGN_INFO_PATH(address)}>
						<p>View Campaign</p>
					</Link>
				),
				fluid: true,
				className: styles.card,
			};
		},
	) as any;

	return (
		<>
			<Card.Group items={items} className={styles.cards} />
			<Link href={CREATE_CAMPAIGN_PATH}>
				<Button
					content="Create Campaign"
					icon="add circle"
					labelPosition="left"
					primary
					className={styles.Button}
				/>
			</Link>
		</>
	);
};
