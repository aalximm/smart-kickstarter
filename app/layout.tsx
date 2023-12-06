import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Layout, Web3Wrapper } from '@/components';
import 'semantic-ui-css/semantic.min.css';

const font = Roboto({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Smart Kickstarter',
	description: 'eth course',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<Web3Wrapper>
				<body className={font.className}>
					<Layout>{children}</Layout>
				</body>
			</Web3Wrapper>
		</html>
	);
}
