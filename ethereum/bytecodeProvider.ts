import path from 'path';
import fs from 'fs';

export const getByteCode = (name: string) => {
	const bytecodePath: string = path.join(__dirname, 'build', `${name}.bin`);
	return fs.readFileSync(bytecodePath, 'utf8');
};
