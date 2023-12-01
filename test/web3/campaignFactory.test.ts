/**
 * @jest-environment node
 */
import Web3, { Contract } from 'web3';
import assert from 'assert';
import Ganache from 'ganache';

import getByteCode from '../../ethereum/bytecodeProvider';
import CampaignFactoryAbi from '../../ethereum/build/CampaignFactory.json';
import CampaignAbi from '../../ethereum/build/Campaign.json';

const bytecode = getByteCode('CampaignFactory');
const web3 = new Web3(Ganache.provider());

let accounts: string[] = [];
let factory: Contract<typeof CampaignFactoryAbi>;

beforeAll(async () => {
	accounts = await web3.eth.getAccounts();
}, 5000);

beforeEach(async () => {
	factory = await new web3.eth.Contract(CampaignFactoryAbi)
		.deploy({
			input: bytecode,
		})
		.send({ from: accounts[0], gas: '10000000' });
}, 5000);

describe('CampaignFactory contract test', () => {
	it('Can be deployed', () => {
		assert.ok(
			factory.options.address,
			'Somethging wrong with factory deployment',
		);
	});

	it('Can produce Campaign instants', async () => {
		const expectedManager = accounts[1];
		await factory.methods.createCampaign('100').send({
			from: expectedManager,
			gas: '1000000',
		});

		const campaignAddresses: string[] = await factory.methods
			.getDeployedCampaigns()
			.call();
		assert.ok(
			campaignAddresses.length == 1,
			`There are not 1 campaign, actual number: ${campaignAddresses.length}`,
		);

		const campaign = new web3.eth.Contract(
			CampaignAbi,
			campaignAddresses[0],
		);

		const manager = await campaign.methods.manager().call();
		assert.equal(expectedManager, manager, 'Unexpected manager aggress');
	});
});
