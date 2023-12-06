'use client';

import { BackButton, CampaignSummary, ICampaignSummary, useWeb3 } from '@/components';
import { CAMPAIGNS_PATH, CAMPAIGN_INFO_PATH } from '@/constant/paths';
import { CAMPAIGN_VIEW_TITLE } from '@/constant/text';
import { getCampaignContract } from '@/ethereum/utils';
import { useEffect, useState } from 'react';
import { Container, Dimmer, Loader, Segment } from 'semantic-ui-react';

export default function CampaignView({
	params,
}: {
	params: { campaignAddress: string };
}): JSX.Element {
	const { web3 } = useWeb3();
	const [campaignSummary, setCampaignSummary] = useState<ICampaignSummary>();
	useEffect(() => {
		const fetchContract = async () => {
			if (!web3) return;
			const campaign = getCampaignContract(web3, params.campaignAddress);
			const results: any[] = await campaign.methods.getSummary().call();
			setCampaignSummary({
				minimumContribution: BigInt(results[0]).toString(),
				balance: BigInt(results[1]).toString(),
				requestsCount: BigInt(results[2]).toString(),
				approversCount: BigInt(results[3]).toString(),
				manager: results[4],
			});
		};

		fetchContract();
	}, [params.campaignAddress, web3]);

	return (
		<>
			<h3>{CAMPAIGN_VIEW_TITLE}</h3>
			<BackButton path={CAMPAIGNS_PATH} />
			<Dimmer.Dimmable blurring>
				<Dimmer active={!campaignSummary} inverted>
					<Loader inverted>Loading</Loader>
				</Dimmer>
				<CampaignSummary
					summary={campaignSummary}
					address={params.campaignAddress}
				/>
			</Dimmer.Dimmable>
		</>
	);
}
