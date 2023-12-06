'use server';

import { getFactoryContract } from '@/ethereum/utils';
import { serverSideWeb3 } from '@/ethereum/web3provider.server';
import { unstable_cache } from 'next/cache';
import Web3 from 'web3';

export const getCampaigns = unstable_cache(
	async (web3?: Web3) => {
		console.log('new getCampaigns call');
		const factory = getFactoryContract(web3 ?? serverSideWeb3);
		const campaigns: string[] = (await factory.methods
			.getDeployedCampaigns()
			.call()
			.catch((err) => {
				console.log(JSON.stringify(err));
				return Promise.resolve([]);
			})) as string[];

		return campaigns;
	},
	undefined,
	{ revalidate: 3600 },
);
