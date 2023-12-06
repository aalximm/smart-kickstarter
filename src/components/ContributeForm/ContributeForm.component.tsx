'use client';

import { Button, Form, Label, Message } from 'semantic-ui-react';
import {
	CONTRIBUTE_BUTTON_TEXT,
	CONTRIBUTE_INPUT_LABEL,
	CONTRIBUTION_COMPLETED_MESSAGE,
	ETHER,
	NUMBER_VALIDATION_ERROR_MESSAGE,
	OOPS_ERROR_MESSAGE,
	TRANSACTION_COMPLETED_MESSAGE,
	TRANSACTION_ERROR_MESSAGE,
} from '@/constant/text';
import { ChangeEvent, useState } from 'react';
import { FLOAT_REGEXP } from '@/constant/regexp';
import { useWeb3 } from '@/components';
import { getCampaignContract } from '@/ethereum/utils';
import { ValidatedValueFactory } from '@/hooks/validation.hook';
import { HandleSubmitFactory } from '@/helpers';

export interface ContributeFormProps {
	address: string;
}

export const ContributeForm = ({
	address,
}: ContributeFormProps): JSX.Element => {
	const { web3, getAccounts } = useWeb3();
	const [contributionAmount, setContributionAmount] =
		ValidatedValueFactory(FLOAT_REGEXP)();
	const [result, setResult] = useState<{
		success: boolean;
		message: string;
	}>();
	const [loading, setLoading] = useState(false);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setResult(undefined);
		setContributionAmount(event.target.value);
	};

	const handleSubmit = HandleSubmitFactory(
		async () => {
			const accounts = await getAccounts!();
			const contract = getCampaignContract(web3!, address);
			await contract.methods.contribute().send({
				from: accounts[0],
				value: web3!.utils.toWei(contributionAmount.value, 'ether'),
			});
		},
		() => {
			setResult({
				success: true,
				message: CONTRIBUTION_COMPLETED_MESSAGE,
			});
			setContributionAmount('');
		},
		(err) => {
			console.error(JSON.stringify(err));
			setResult({
				success: false,
				message: TRANSACTION_ERROR_MESSAGE,
			});
		},
		setLoading,
	);

	return (
		<Form
			error={result !== undefined && !result.success}
			success={result !== undefined && result.success}
			loading={loading}
			onSubmit={handleSubmit}
		>
			<Form.Field>
				<label>{CONTRIBUTE_INPUT_LABEL}</label>
				<Form.Input
					error={
						contributionAmount.isInvalid && {
							content: NUMBER_VALIDATION_ERROR_MESSAGE,
						}
					}
					labelPosition="right"
					value={contributionAmount.value}
					onChange={handleChange}
				>
					<input />
					<Label>{ETHER}</Label>
				</Form.Input>
			</Form.Field>
			<Message
				success
				header={TRANSACTION_COMPLETED_MESSAGE}
				content={result?.message}
			/>
			<Message
				error
				header={OOPS_ERROR_MESSAGE}
				content={result?.message}
			/>
			<Form.Button primary disabled={contributionAmount.isInvalid}>
				{CONTRIBUTE_BUTTON_TEXT}
			</Form.Button>
		</Form>
	);
};
