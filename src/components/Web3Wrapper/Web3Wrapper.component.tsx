'use client';

import { createContext, useEffect, useState, useContext } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Getter, Maybe } from '@/types';

export interface Web3WrapperProps {
	children: React.ReactNode;
}

export interface Web3ContextProps {
	web3?: Web3;
	getAccounts?: Getter<string[]>;
	connectWallet?: Getter<string[]>;
}

const Web3Context = createContext<Web3ContextProps>({});

export const Web3Wrapper = ({ children }: Web3WrapperProps): JSX.Element => {
	const [web3, setWeb3] = useState<Web3>();
	const [getAccounts, setGetAccounts] = useState<Getter<string[]>>();
	const [connectWallet, setConnectWallet] = useState<Getter<string[]>>();

	useEffect(() => {
		const init = async () => {
			const ethProvider = await detectEthereumProvider();

			if (ethProvider) {
				const web3 = new Web3(ethProvider as any);
				setWeb3(web3);
				setConnectWallet(() => connectWalletFactory(web3));
				setGetAccounts(() => getAccountsFactory(web3));
				console.log('inject web3 provider from window');
			} else {
				console.log('web3 provider doesnt detected');
			}
		};

		init();
	}, []);

	return (
		<Web3Context.Provider
			value={{
				web3: web3,
				getAccounts: getAccounts,
				connectWallet: connectWallet,
			}}
		>
			{children}
		</Web3Context.Provider>
	);
};

export const useWeb3 = () => {
	return useContext(Web3Context);
};

const connectWalletFactory = (web3: Web3): Getter<string[]> => {
	return async () => {
		return await web3.eth.requestAccounts();
	};
};

const getAccountsFactory = (web3: Web3): Getter<string[]> => {
	return async () => {
		let accounts: Maybe<string[]> = await web3.eth.getAccounts();
		if (accounts.length == 0) accounts = await web3.eth.requestAccounts();
		if (!accounts || accounts.length == 0)
			throw new Error('Accounts not found');

		return accounts;
	};
};
