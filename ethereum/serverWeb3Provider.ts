import Web3 from "web3"

export const provider = new Web3.providers.HttpProvider(
	process.env.INFURA_PROVIDER_URL!
)

export const serverSideWeb3 = new Web3(provider);