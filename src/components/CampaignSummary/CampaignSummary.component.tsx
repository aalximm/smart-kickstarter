'use client';

import { CampaignInfo, ContributeForm, ICampaignSummary } from '@/components';
import { CAMPAIGN_REQUESTS_PATH } from '@/constant/paths';
import { VIEW_REQUESTS_BUTTON_TEXT } from '@/constant/text';
import Link from 'next/link';
import { Grid, Button } from 'semantic-ui-react';
import web3 from 'web3';

export interface CampaignSummaryProps {
	summary?: ICampaignSummary;
	address: string;
}

export const CampaignSummary = ({
	summary,
	address,
}: CampaignSummaryProps): JSX.Element => {
	const defaultSummary = {
		minimumContribution: '',
		balance: '',
		requestsCount: '',
		approversCount: '',
		manager: '',
	};

	return (
		<Grid>
			<Grid.Row>
				<Grid.Column width={13}>
					<CampaignInfo
						summary={summary ?? defaultSummary}
						fromWei={(wei: string) => {
							return web3!.utils.fromWei(wei, 'ether');
						}}
					/>
				</Grid.Column>
				<Grid.Column width={3}>
					<ContributeForm address={address} />
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column>
					<Link href={CAMPAIGN_REQUESTS_PATH(address)}>
						<Button primary>{VIEW_REQUESTS_BUTTON_TEXT}</Button>
					</Link>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};
