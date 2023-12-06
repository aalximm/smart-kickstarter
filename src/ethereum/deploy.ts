import fs from 'fs';
import path from 'path';
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';

import { getEnv } from './utils.server';
import CampaignFactoryAbi from './build/CampaignFactory.json';


const env = getEnv();
const mnemonic = env.MNEMONIC_PHRASE!;
const infuraUrl = env.INFURA_PROVIDER_URL!;

const provider = new HDWalletProvider({
	mnemonic: mnemonic,
	providerOrUrl: infuraUrl,
});
const web3 = new Web3(provider as any);

const getByteCode = (name: string) => {
	const bytecodePath: string = path.join(__dirname, 'build', `${name}.bin`);
	return fs.readFileSync(bytecodePath, 'utf8');
};
const bytecode = getByteCode('CampaignFactory');

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
