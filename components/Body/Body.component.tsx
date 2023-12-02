import { DivProps } from 'react-html-props';
import cn from 'classnames';
import styles from './Body.module.css';
import { Campaigns, CreateCampaignButton } from '@/components';
import { Header } from 'semantic-ui-react';

export interface BodyProps extends DivProps {
	campaigns: string[];
}

export const Body = ({
	campaigns,
	className,
	...props
}: BodyProps): JSX.Element => {
	return (
		<div className={cn(className, styles.Body)} {...props}>
			<h1 className={styles.Header}>Open Campaigns</h1>
			<Campaigns addresses={campaigns} className={styles.Campaigns} />
			<CreateCampaignButton
				content="Create Campaign"
				className={styles.Button}
			/>
		</div>
	);
};
