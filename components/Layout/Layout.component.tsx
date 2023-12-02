import { DivProps } from 'react-html-props';
import cn from 'classnames';
import styles from './Layout.module.css';
import { Header } from '@/components';
import { Container } from 'semantic-ui-react';

export interface LayoutProps extends DivProps {
	children: React.ReactNode;
}

export const Layout = ({
	children,
	className,
	...props
}: LayoutProps): JSX.Element => {
	return (
		<Container className={cn(className, styles.Layout)} {...props} fluid>
			<Header />
			{children}
		</Container>
	);
};
