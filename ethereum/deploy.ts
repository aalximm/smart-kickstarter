import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import dotenv from 'dotenv';

import CampaignFactoryAbi from './build/CampaignFactory.json';
import { getByteCode } from './bytecodeProvider';
import { getEnv } from './config.local';

const bytecode = getByteCode('CampaignFactory');

const env = getEnv();
const mnemonic = env.MNEMONIC_PHRASE!;
const infuraUrl = env.INFURA_PROVIDER_URL!;

const provider = new HDWalletProvider({
	mnemonic: mnemonic,
	providerOrUrl: infuraUrl,
});
const web3 = new Web3(provider as any);

async function deployContract() {
	const accounts = await web3.eth.getAccounts();

	console.log('trying to deploy contract');
	const result = await new web3.eth.Contract(CampaignFactoryAbi)
		.deploy({ data: bytecode })
		.send({ from: accounts[0], gas: '10000000' });
	console.log(`contract deployed at address ${result.options.address}`);
	
	provider.engine.stop();
	return;
}

deployContract();
