'use client';

import {
	BackButton,
	CampaignSummary,
	IRequestInfo,
	RequestsInfo,
	useWeb3,
} from '@/components';
import {
	CAMPAIGN_INFO_PATH,
	CAMPAIGN_REQUESTS_PATH,
	NEW_REQUEST_PATH,
} from '@/constant/paths';
import {
	CREATE_REQUESTS_BUTTON_TEXT,
	REQUESTS_VIEW_TITLE,
} from '@/constant/text';
import { getCampaignContract } from '@/ethereum/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Dimmer, Divider, Loader } from 'semantic-ui-react';

export default function CampaignRequests({
	params,
}: {
	params: { campaignAddress: string };
}): JSX.Element {
	const { web3 } = useWeb3();
	const [requests, setRequests] = useState<IRequestInfo[]>();
	const [contributorsCount, setContributorsCount] = useState('0');
	useEffect(() => {
		const fetchRequests = async () => {
			if (!web3) return;
			const campaign = getCampaignContract(web3, params.campaignAddress);
			const requestCount: number = await campaign.methods
				.getRequestsCount()
				.call();

			const tasks: Promise<IRequestInfo>[] = [];

			for (let i = 0; i < requestCount; i++){
				tasks.push((campaign.methods as any).requests(i).call());
			}
			const requests = await Promise.all(tasks);

			const contributorsCount: string = await campaign.methods
				.approversCount()
				.call();

			setContributorsCount(BigInt(contributorsCount).toString());
			setRequests(requests);
		};

		fetchRequests();
	}, [params.campaignAddress, web3]);

	return (
		<>
			<h3>{REQUESTS_VIEW_TITLE}</h3>
			<BackButton path={CAMPAIGN_INFO_PATH(params.campaignAddress)} />
			<Dimmer.Dimmable blurring>
				<Dimmer active={!requests} inverted>
					<Loader inverted>Loading</Loader>
				</Dimmer>
				<RequestsInfo
					requests={requests}
					address={params.campaignAddress}
					contributorsCount={contributorsCount}
				/>
			</Dimmer.Dimmable>
			<Divider hidden />
			<Link href={NEW_REQUEST_PATH(params.campaignAddress)}>
				<Button primary>{CREATE_REQUESTS_BUTTON_TEXT}</Button>
			</Link>
		</>
	);
}
