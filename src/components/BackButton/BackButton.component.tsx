'use client';

import { DivProps } from 'react-html-props';
import styles from './BackButton.module.css';
import Link from 'next/link';
import { Button, Divider } from 'semantic-ui-react';

export interface BackButtonProps extends DivProps {
	path: string
}

export const BackButton = ({
	path
}: BackButtonProps): JSX.Element => {
	return (
		<Link href={path} className={styles.BackButton}>
			<Button>Back</Button>
			<Divider hidden />
		</Link>
	);
};
