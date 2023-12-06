import { DivProps } from 'react-html-props';
import { Header } from '@/components';
import { Container } from 'semantic-ui-react';
import styles from './Layout.module.css';

export interface LayoutProps extends DivProps {
	children: React.ReactNode;
}

export const Layout = ({
	children,
	className,
	...props
}: LayoutProps): JSX.Element => {
	return (
		<div className={styles.Layout}>
			<Header />
			<Container>{children}</Container>
		</div>
	);
};
