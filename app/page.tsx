import { Body, Campaigns, CreateCampaignButton } from '@/components';
import { getFactory, serverSideWeb3 } from '@/ethereum';

import { cache } from 'react';

export default async function Home() {
	const campaigns = await getCampaigns();
	return (
		<Body campaigns={campaigns}/>
	);
}

const getCampaigns = cache(async () => {
	// const factory = getFactory(serverSideWeb3);
	// const campaigns: string[] = await factory.methods
	// 	.getDeployedCampaigns()
	// 	.call()
	// 	.catch((err) => {
	// 		console.log(JSON.stringify(err));
	// 		return Promise.resolve([]);
	// 	}) as string[];

	return [
		'0xAdeB484F035f1E10d4a6059d5629Db800cB3e548',
		'0xAdeB484F035f1E10d4a6059d5629Db800cB3e549',
		'0xAdeB484F035f1E10d4a6059d5629Db800cB3e547',
	];
});
