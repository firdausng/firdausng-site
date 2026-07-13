export type Project = {
	name: string;
	url: string;
	/** Short one-liner — used on /about. */
	blurb: string;
	/** Longer description — used on the homepage project sidebar. */
	description: string;
	/** Tech tags — homepage sidebar. */
	tags: string[];
	logo: string;
	/** Deployment status — homepage. */
	status: string;
	/** How I'm involved — /about. SaaS I own & run vs. work built for someone else. */
	role: string;
};

/** Things I'm building / have built. Single source for the homepage + /about. */
export const PROJECTS: Project[] = [
	{
		name: 'DuitGee',
		url: 'https://duitgee.com',
		blurb: 'Group expense tracking with shared vaults — track money, not drama.',
		description:
			'A group expense-tracking platform enabling shared cost management among roommates, travelers, and families. Establish shared accounts and reconcile debts seamlessly.',
		tags: ['cloudflare', 'svelte', 'hono', 'drizzle'],
		logo: 'https://duitgee.com/favicon.svg',
		status: 'Live',
		role: 'Built & operate'
	},
	{
		name: 'Gee Ledger',
		url: 'https://geeledger.com',
		blurb: 'Multi-business accounting for freelancers & entrepreneurs — income, invoicing, products, team access.',
		description:
			'An accounting platform for freelancers and entrepreneurs managing multiple ventures. Handle invoicing, income tracking, and team administration across different businesses.',
		tags: ['cloudflare', 'svelte', 'hono', 'drizzle'],
		logo: 'https://geeledger.com/favicon.svg',
		status: 'Live',
		role: 'Built & operate'
	},
	{
		name: 'BikeSynergy',
		url: 'https://bikesynergy.com',
		blurb: 'Mountain-bike retail, maintenance & coaching e-commerce.',
		description:
			'A specialized mountain bike retailer offering equipment sales, on-campus maintenance services, and professional coaching with over two decades of industry experience.',
		tags: ['cloudflare', 'svelte', 'hono'],
		logo: 'https://bikesynergy.com/favicon.ico?v=2',
		status: 'Live',
		role: 'Built & operate'
	},
	{
		name: "Gee's Pes Kisar",
		url: 'https://nurzerani.com',
		blurb: 'WhatsApp-first ordering site for a home-based fresh sambal-paste business in Nilai.',
		description:
			'A WhatsApp-first ordering site for a home-based fresh sambal-paste business in Nilai — freshly-ground pastes delivered weekly, with a live order-builder and standing-order (langganan) flow.',
		tags: ['cloudflare', 'svelte', 'tailwind'],
		logo: 'https://nurzerani.com/favicon.svg',
		status: 'Live',
		role: 'Built the site'
	}
];
