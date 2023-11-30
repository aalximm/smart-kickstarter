/**
 * @jest-environment node
 */
import Web3, { Contract, ContractAbi } from 'web3';
import assert from 'assert';
import Ganache from 'ganache';
import path from 'path';
import fs from 'fs';

import CampaignFactoryAbi from '../../ethereum/build/CampaignFactory.json';
import CampaignAbi from '../../ethereum/build/Campaign.json';

const bytecodePath: string = path.join(
	__dirname,
	'..',
	'..',
	'ethereum',
	'build',
	'CampaignFactory.bin',
);
const bytecode: string = fs.readFileSync(bytecodePath, 'utf8');

const web3 = new Web3(Ganache.provider());

let accounts: string[] = [];
let manager: string;
let factory: Contract<typeof CampaignFactoryAbi>;
let campaign: Contract<typeof CampaignAbi>;
let campaignAddress: string;

beforeAll(async () => {
	accounts = await web3.eth.getAccounts();
	manager = accounts[1];
}, 5000);

beforeEach(async () => {
	factory = await new web3.eth.Contract(CampaignFactoryAbi)
		.deploy({
			input: bytecode,
		})
		.send({ from: accounts[0], gas: '10000000' });

	await factory.methods.createCampaign('100').send({
		from: manager,
		gas: '1000000',
	});

	[campaignAddress] = await factory.methods.getDeployedCampaigns().call();
	assert.ok(campaignAddress, 'There are no campaigns');

	campaign = new web3.eth.Contract(CampaignAbi, campaignAddress);
}, 5000);

describe('CampaignFactory contract test', () => {
	it('Deploys a factory and a campaign', async () => {
		assert.ok(factory.options.address, 'Problem with factory deployment');
		assert.ok(campaign.options.address, 'Problem with campaign deployment');
	});

	it('Allows people to contribute money', async () => {
		const contributer = accounts[2];
		await campaign.methods.contribute().send({
			value: '200',
			from: contributer,
		});
		const isContributor = await campaign.methods
			.approvers(contributer)
			.call();
		assert.ok(isContributor, 'Contributor hasnt saved');
	});

	it('Requires a minimum contribution', () => {
		assert.rejects(
			async () =>
				await campaign.methods.contribute().send({
					value: '50',
					from: accounts[2],
				}),
			'You can contribute less then minimum',
		);
	});

	it('Allows a manager and only manager to make payment request', async () => {
		const requestDescription = 'Buy something';
		await campaign.methods
			.createRequest(requestDescription, '100', accounts[3])
			.send({
				from: manager,
				gas: '1000000',
			});
		const request: any = await campaign.methods.requests(0).call();
		assert.equal(requestDescription, request.description);
	});

	it('Doesnt allow other persons to make payment request', async () => {
		assert.rejects(
			async () =>
				await campaign.methods
					.createRequest('Buy something', '100', accounts[3])
					.send({
						from: accounts[3],
						gas: '1000000',
					}),
			'NOT manager can make request',
		);
	});

	it('Processes requests', async () => {
		const contributor = accounts[2];
		const recipient = accounts[3];
		const value = 5;

		await campaign.methods.contribute().send({
			from: contributor,
			value: web3.utils.toWei('10', 'ether'),
		});
		
		await campaign.methods
			.createRequest('nonce', web3.utils.toWei(value, 'ether'), recipient)
			.send({
				from: manager,
				gas: '1000000',
			});
		
		await campaign.methods.approveRequest(0).send({
			from: contributor,
			gas: '1000000',
		});

		const balanceBefore = parseFloat(
			web3.utils.fromWei(await web3.eth.getBalance(recipient), 'ether'),
		);
		await campaign.methods.finalizeRequest(0).send({
			from: manager,
			gas: '1000000',
		});
		const balanceAfter = parseFloat(
			web3.utils.fromWei(await web3.eth.getBalance(recipient), 'ether'),
		);

		assert.ok(
			balanceBefore + value * 0.9 < balanceAfter,
			'Recipient didnt recieve anought money',
		);
	});
});
