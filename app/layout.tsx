import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Layout, Web3Wrapper } from '@/components';
import 'semantic-ui-css/semantic.min.css';

const inter = Inter({ subsets: ['latin'] });

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
				<body className={inter.className}>
					<Layout>{children}</Layout>
				</body>
			</Web3Wrapper>
		</html>
	);
}
