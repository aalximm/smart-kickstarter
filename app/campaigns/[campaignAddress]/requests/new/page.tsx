'use client';

import { BackButton, NewRequestForm } from '@/components';
import { CAMPAIGN_REQUESTS_PATH } from '@/constant/paths';
import { NEW_REQUEST_TITLE } from '@/constant/text';

export default function NewRequest({
	params,
}: {
	params: { campaignAddress: string };
}): JSX.Element {
	return (
		<>
			<h3>{NEW_REQUEST_TITLE}</h3>
			<BackButton path={CAMPAIGN_REQUESTS_PATH(params.campaignAddress)} />
			<NewRequestForm address={params.campaignAddress} />
		</>
	);
}
