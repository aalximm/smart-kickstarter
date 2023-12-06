import Web3 from 'web3';

import CampaignFactoryAbi from './build/CampaignFactory.json';
import CampaignAbi from './build/Campaign.json';

export const getFactoryContract = (web3: Web3) => {
	const instance = new web3.eth.Contract(
		CampaignFactoryAbi,
		process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
	);
	return instance;
};

export const getCampaignContract = (web3: Web3, address: string) => {
	const instance = new web3.eth.Contract(
		CampaignAbi,
		address,
	);
	return instance;
}