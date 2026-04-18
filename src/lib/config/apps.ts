export const APPS = {
	geeledger: {
		name: 'Gee Ledger',
		url: 'https://geeledger.com',
		tagline: 'Invoicing and bookkeeping built on Cloudflare.'
	},
	duitgee: {
		name: 'DuitGee',
		url: 'https://duitgee.com',
		tagline: 'Expense tracker with vaults for teams and households.'
	},
	bikesynergy: {
		name: 'BikeSynergy',
		url: 'https://bikesynergy.com',
		tagline: 'Mountain-bike e-commerce for The Scots College.'
	}
} as const;

export type AppKey = keyof typeof APPS;
