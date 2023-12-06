'use client';

import { IRequestInfo, useWeb3 } from '@/components';
import { CAMPAIGN_REQUESTS_PATH } from '@/constant/paths';
import { getCampaignContract } from '@/ethereum/utils';
import { useRouter } from 'next/navigation';
import { Button, Table } from 'semantic-ui-react';
import Web3 from 'web3';

export interface RequestRowProps {
	id: number;
	request: IRequestInfo;
	address: string;
	contributorsCount: string;
}

export const RequestRow = ({
	id,
	request,
	address,
	contributorsCount,
}: RequestRowProps): JSX.Element => {
	const { Row, Cell } = Table;
	const { web3, getAccounts } = useWeb3();
	const router = useRouter();

	const readyToFinalize = Number.parseInt(request.approvalsCount) > Number.parseInt(contributorsCount) / 2;

	const approve = async () => {
		if (!web3 || !getAccounts) return;
		const campaign = getCampaignContract(web3, address);
		const accounts = await getAccounts();

		await (campaign.methods as any)
			.approveRequest(id)
			.send({ from: accounts[0] });
		router.replace(CAMPAIGN_REQUESTS_PATH(address));
	};

	const finalize = async () => {
		if (!web3 || !getAccounts) return;
		const campaign = getCampaignContract(web3, address);
		const accounts = await getAccounts();

		await (campaign.methods as any)
			.finalizeRequest(id)
			.send({ from: accounts[0] });
		router.replace(CAMPAIGN_REQUESTS_PATH(address));
	};

	return (
		<Row positive={readyToFinalize && !request.complete} disabled={request.complete}>
			<Cell>{id}</Cell>
			<Cell>{request.description}</Cell>
			<Cell>{Web3.utils.fromWei(request.value, 'ether')}</Cell>
			<Cell>{request.recipient}</Cell>
			<Cell>
				{BigInt(request.approvalsCount).toString()}/{contributorsCount}
			</Cell>
			<Cell>
				{request.complete ? null : (
					<Button color="green" basic onClick={approve}>
						Approve
					</Button>
				)}
			</Cell>
			<Cell>
				{request.complete ? null : (
					<Button color="teal" basic onClick={finalize} disabled={!readyToFinalize}>
						Finalize
					</Button>
				)}
			</Cell>
		</Row>
	);
};
