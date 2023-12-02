import dotenv from 'dotenv';
import path from 'path';

export const getEnv = () => {
	dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });
	return process.env;
};
