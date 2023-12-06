import path from 'path';
import Web3 from 'web3';
import dotenv from 'dotenv';

export const getEnv = () => {
	dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.local') });
	return process.env;
};

