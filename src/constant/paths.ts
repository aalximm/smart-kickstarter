export const CAMPAIGNS_PATH = '/campaigns';
export const CREATE_CAMPAIGN_PATH = '/campaigns/new';
export const CAMPAIGN_INFO_PATH = (address: string) => `/campaigns/${address}`;
export const CAMPAIGN_REQUESTS_PATH = (address: string) =>
	`/campaigns/${address}/requests`;
export const NEW_REQUEST_PATH = (address: string) =>
	`/campaigns/${address}/requests/new`;
