import path from 'path';
import fs from 'fs-extra';
const solc = require('solc');

function compileContracts(contractPath: string, outputPath: string): void {
	console.log(`Trying to compile contracts from ${contractPath}`);

	const contracts: { content: string }[] = [];

	fs.removeSync(outputPath);
	const files = fs
		.readdirSync(contractPath)
		.filter((file: any) => file.endsWith('.sol'));

	if (files.length == 0) {
		console.error('Error: Contracts not found');
		return;
	}

	files.forEach((file: any) => {
		const filePath = path.join(contractPath, file);
		const contractSource = fs.readFileSync(filePath, 'utf-8');
		contracts.push({ content: contractSource });
	});

	let sources = {} as any;
	contracts.forEach((contract, index) => {
		const fileName = `Contract${index}.sol`;
		sources[fileName] = contract;
	});

	const input = {
		language: 'Solidity',
		sources: sources,
		settings: {
			outputSelection: {
				'*': {
					'*': ['*'],
				},
			},
		},
	};

	const compiledOutput = JSON.parse(solc.compile(JSON.stringify(input)));
	if (compiledOutput?.errors && compiledOutput?.errors.length > 0) {
		console.error('Errors occured during compilation:');
		compiledOutput.errors.forEach((error: any) =>
			console.error(error.message),
		);
		return;
	} else console.log('Contracts compiled successfully');

	for (const contractFileName in compiledOutput.contracts) {
		for (const contractName in compiledOutput.contracts[contractFileName]) {
			const contract =
				compiledOutput.contracts[contractFileName][contractName];

			createFile(
				path.resolve(outputPath, `${contractName}.json`),
				JSON.stringify(contract.abi),
			);
			createFile(
				path.resolve(outputPath, `${contractName}.bin`),
				contract.evm.bytecode.object,
			);
		}
	}

	console.log(`Contracts saved successfully, check ${outputPath}`);
}

function createFile(filePath: string, content: string): void {
	const directory = path.dirname(filePath);

	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}

	fs.writeFileSync(filePath, content, 'utf-8');
}

const contractsPath = process.argv[2];
const outputPath = process.argv[3];

compileContracts(contractsPath, outputPath);
