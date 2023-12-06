'use client'

import styles from './CampaignInfo.module.css';
import { Card, CardProps, SemanticShorthandCollection } from 'semantic-ui-react';

export interface CampaignInfoProps {
	summary: ICampaignSummary;
	fromWei: (wei: string) => string;
}

export interface ICampaignSummary {
	minimumContribution: string;
	balance: string;
	requestsCount: string;
	approversCount: string;
	manager: string;
}

export const CampaignInfo = ({ summary, fromWei }: CampaignInfoProps): JSX.Element => {
	return <Card.Group items={getItemsFromSummary(summary, fromWei)} />;
};

//TODO убрать тексты из хардкода
const getItemsFromSummary = (campaignSummary: ICampaignSummary, fromWei: (wei: string) => string) => {
	const items: CardProps[] = [
		{
			header: campaignSummary.manager,
			meta: 'Address of Manager',
			description:
				'The manager created this campaign and can create requests to withdraw money',
			className: styles.ManagerCard,
		},
		{
			header: campaignSummary.minimumContribution,
			meta: 'Minimum Contribution (wei)',
			description:
				'You must contribute at least this much wei to become an approver',
		},
		{
			header: campaignSummary.requestsCount,
			meta: 'Number of Requests',
			description:
				'A requests tries to withdraw money from the contract. Request must be approved by approvers',
		},
		{
			header: campaignSummary.approversCount,
			meta: 'Number of Approvers',
			description:
				'Number of people who have already donated to this campaign',
		},
		{
			header: fromWei(campaignSummary.balance),
			meta: 'Campaign Balance (ether)',
			description:
				'The balance is how much money this campaign has left to spend',
		},
	];
	return items as SemanticShorthandCollection<CardProps>;
};
