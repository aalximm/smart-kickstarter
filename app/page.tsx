import { Campaigns } from '@/components';
import { getCampaigns } from '@/helpers';
import { OPEN_CAMPAIGNS_TITLE } from '@/constant/text';

export default async function Home() {
	const campaigns = await getCampaigns();
	return (
		<>
			<h3>{OPEN_CAMPAIGNS_TITLE}</h3>
			<Campaigns addresses={campaigns} />
		</>
	);
}
