'use client';

import { Button, Icon, Menu } from 'semantic-ui-react';
import styles from './Header.module.css';
import Link from 'next/link';
import { CREATE_CAMPAIGN_PATH } from '@/constant/paths';

export const Header = (): JSX.Element => {
	return (
		<Menu className={styles.Header} as="div">
			<Menu.Item>
				<Link href="/">CrowdCoin</Link>
			</Menu.Item>

			<Menu.Menu position="right">
				<Menu.Item>
					<Link href="/">Campaigns</Link>
				</Menu.Item>
				<Menu.Item>
					<Link href={CREATE_CAMPAIGN_PATH}>
						<Icon
							name="add circle"
							link
							size="large"
							color="blue"
						/>
					</Link>
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);
};
