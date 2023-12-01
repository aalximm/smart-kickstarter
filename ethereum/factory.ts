import Web3 from 'web3';
import CampaignFactoryAbi from './build/CampaignFactory.json';

export const getFactory = (web3: Web3) => {
	const instance = new web3.eth.Contract(
		CampaignFactoryAbi,
		process.env.NEXT_PUBLIC_FACTORY_ADDRESS
	);
	return instance;
}