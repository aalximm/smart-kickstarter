'use client';

import { Icon, Menu } from 'semantic-ui-react';
import styles from './Header.module.css';

export const Header = (): JSX.Element => {
	return (
		<Menu className={styles.Header} as='div'>
			<Menu.Item>CrowdCoin</Menu.Item>

			<Menu.Menu position="right">
				<Menu.Item>Campaigns</Menu.Item>
				<Menu.Item><Icon name='add circle'/></Menu.Item>
			</Menu.Menu>
		</Menu>
	);
};
