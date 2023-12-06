'use client';

import { useWeb3 } from '@/components';
import { CAMPAIGN_REQUESTS_PATH } from '@/constant/paths';
import { FLOAT_REGEXP } from '@/constant/regexp';
import {
	CREATE_CAMPAIGN_BUTTON_TEXT,
	DESCRIPTION_INPUT_LABEL,
	ETHER,
	NUMBER_VALIDATION_ERROR_MESSAGE,
	OOPS_ERROR_MESSAGE,
	RECIPIENT_INPUT_LABEL,
	REQUEST_CREATED_MESSAGE,
	TRANSACTION_COMPLETED_MESSAGE,
	TRANSACTION_ERROR_MESSAGE,
	VALUE_IN_ETHER_INPUT_LABEL,
} from '@/constant/text';
import { getCampaignContract } from '@/ethereum/utils';
import { HandleSubmitFactory } from '@/helpers';
import { ValidatedValueFactory } from '@/hooks/validation.hook';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { Button, Form, Label, Message } from 'semantic-ui-react';

export interface NewRequestFormProps {
	address: string;
}

export const NewRequestForm = ({
	address,
}: NewRequestFormProps): JSX.Element => {
	const { web3, getAccounts } = useWeb3();
	const router = useRouter();

	const [description, setDescription] = useState('');
	const [requestAmount, setRequestAmount] =
		ValidatedValueFactory(FLOAT_REGEXP)();
	const [recipient, setRecipient] = useState('');

	const [result, setResult] = useState<{
		success: boolean;
		message: string;
	}>();
	const [loading, setLoading] = useState(false);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setResult(undefined);
		setRequestAmount(event.target.value);
	};

	const handleSubmit = HandleSubmitFactory(
		async () => {
			const accounts: string[] = await getAccounts!();
			const campaign = getCampaignContract(web3!, address);
			await (campaign.methods as any)
				.createRequest(
					description,
					web3!.utils.toWei(requestAmount.value, 'ether'),
					recipient,
				)
				.send({
					from: accounts[0],
				});
		},
		() => {
			setResult({ success: true, message: REQUEST_CREATED_MESSAGE });
			setDescription('');
			setRecipient('');
			setRequestAmount('');
			router.push(CAMPAIGN_REQUESTS_PATH(address));
		},
		(err) => {
			console.error(err);
			setResult({ success: false, message: TRANSACTION_ERROR_MESSAGE });
		},
		setLoading,
	);

	return (
		<Form
			loading={loading}
			error={result && !result.success}
			success={result && result.success}
			onSubmit={handleSubmit}
		>
			<Form.Field required>
				<label>{DESCRIPTION_INPUT_LABEL}</label>
				<Form.Input
					value={description}
					onChange={(event) => setDescription(event.target.value)}
				/>
			</Form.Field>
			<Form.Field required>
				<label>{VALUE_IN_ETHER_INPUT_LABEL}</label>
				<Form.Input
					value={requestAmount.value}
					onChange={handleChange}
					error={
						requestAmount.isInvalid && {
							content: NUMBER_VALIDATION_ERROR_MESSAGE,
						}
					}
					labelPosition="right"
				>
					<input />
					<Label>{ETHER}</Label>
				</Form.Input>
			</Form.Field>
			<Form.Field required>
				<label>{RECIPIENT_INPUT_LABEL}</label>
				<Form.Input
					value={recipient}
					onChange={(event) => setRecipient(event.target.value)}
				/>
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
			<Form.Button
				primary
				disabled={
					requestAmount.isInvalid ||
					requestAmount.value == '' ||
					recipient == '' ||
					description == ''
				}
			>
				{CREATE_CAMPAIGN_BUTTON_TEXT}
			</Form.Button>
		</Form>
	);
};
