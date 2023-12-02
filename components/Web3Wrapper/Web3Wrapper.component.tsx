'use client';

import { createContext, useEffect, useState, useContext } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Nullable } from '@/types';

export interface Web3WrapperProps {
	children: React.ReactNode;
}

export interface Web3ContextProps {
	web3: Nullable<Web3>;
}

const Web3Context = createContext<Web3ContextProps>({ web3: null });

export const Web3Wrapper = ({ children }: Web3WrapperProps): JSX.Element => {
	const [web3, setWeb3] = useState<Web3 | null>(null);
	useEffect(() => {
		const init = async () => {
			const ethProvider = await detectEthereumProvider();

			let web3: Web3;

			if (ethProvider) {
				web3 = new Web3(ethProvider as any);
				setWeb3(web3);
				console.log('Inject web3 provider from window');
			} else {
				console.log('web3 provider doesnt detected');
				setWeb3(null);
			}
		};

		init();
	}, []);

	return (
		<Web3Context.Provider value={{ web3: web3 }}>
			{children}
		</Web3Context.Provider>
	);
};

export const useWeb3 = () => {
	return useContext(Web3Context);
};
