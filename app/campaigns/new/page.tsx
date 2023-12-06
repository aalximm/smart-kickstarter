import { CreateCampaignForm } from '@/components';
import { CREATE_CAMPAIGN_TITLE } from '@/constant/text';
import { revalidatePath } from 'next/cache';

async function updateCampaigns() {
	'use server';

	revalidatePath('/', 'page');
}

export default function CampaignNew(): JSX.Element {
	return (
		<>
			<h3>{CREATE_CAMPAIGN_TITLE}</h3>
			<CreateCampaignForm updateCampaigns={updateCampaigns} />
		</>
	);
}
