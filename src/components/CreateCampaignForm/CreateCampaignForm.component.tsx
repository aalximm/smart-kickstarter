'use client';

import {
	INTEGER_VALIDATION_ERROR_MESSAGE,
	WEI,
	TRANSACTION_COMPLETED_MESSAGE,
	OOPS_ERROR_MESSAGE,
	CREATE_CAMPAIGN_BUTTON_TEXT,
	CAMPAIGN_CREATED_MESSAGE,
	TRANSACTION_ERROR_MESSAGE,
	MINIMUM_CONTRIBUTION_INPUT_LABEL,
} from '@/constant/text';
import { Form, Label, Message, Button } from 'semantic-ui-react';
import { useWeb3 } from '@/components';
import { INTEGER_REGEXP } from '@/constant/regexp';
import { getFactoryContract } from '@/ethereum/utils';
import { ValidatedValueFactory } from '@/hooks/validation.hook';
import { HandleSubmitFactory } from '@/helpers/eventHandlers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface CreateCampaignFormProps {
	updateCampaigns: () => Promise<void>;
}

export const CreateCampaignForm = ({
	updateCampaigns,
}: CreateCampaignFormProps): JSX.Element => {
	const { web3, getAccounts } = useWeb3();
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<{
		success: boolean;
		message: string;
	}>();
	const router = useRouter();

	const [minimumContribution, setMinimumContribution] =
		ValidatedValueFactory(INTEGER_REGEXP)();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setResult(undefined);
		setMinimumContribution(value);
	};

	const handleSubmit = HandleSubmitFactory(
		async () => {
			const accounts = await getAccounts!();
			const factory = getFactoryContract(web3!);
			await (factory.methods as any)
				.createCampaign(minimumContribution.value)
				.send({
					from: accounts[0],
				});
		},
		() => {
			setMinimumContribution('');
			setResult({
				success: true,
				message: CAMPAIGN_CREATED_MESSAGE,
			});
			updateCampaigns();
			router.push('/');
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
			onSubmit={handleSubmit}
			loading={loading}
			success={result !== undefined && result.success}
			error={result !== undefined && !result.success}
		>
			<Form.Field required={true}>
				<label>{MINIMUM_CONTRIBUTION_INPUT_LABEL}</label>
				<Form.Input
					error={
						minimumContribution.isInvalid && {
							content: INTEGER_VALIDATION_ERROR_MESSAGE,
						}
					}
					labelPosition="right"
					fluid
					value={minimumContribution.value}
					onChange={handleChange}
				>
					<input />
					<Label>{WEI}</Label>
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
			<Button primary disabled={minimumContribution.isInvalid}>
				{CREATE_CAMPAIGN_BUTTON_TEXT}
			</Button>
		</Form>
	);
};
