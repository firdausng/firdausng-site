export type Project = {
	name: string;
	url: string;
	blurb: string;
	/** How I'm involved — SaaS I own & run vs. work I built for someone else. */
	role: string;
};

/** Things I'm building / have built. Newest-first. Rendered on /about. */
export const PROJECTS: Project[] = [
	{
		name: "Gee's Pes Kisar",
		url: 'https://nurzerani.com',
		blurb: 'WhatsApp-first ordering site for a home-based fresh sambal-paste business in Nilai.',
		role: 'Built the site'
	},
	{
		name: 'Gee Ledger',
		url: 'https://geeledger.com',
		blurb: 'Multi-business accounting for freelancers & entrepreneurs — income, invoicing, products, team access.',
		role: 'Built & operate'
	},
	{
		name: 'DuitGee',
		url: 'https://duitgee.com',
		blurb: 'Group expense tracking with shared vaults — track money, not drama.',
		role: 'Built & operate'
	},
	{
		name: 'BikeSynergy',
		url: 'https://bikesynergy.com',
		blurb: 'Mountain-bike retail, maintenance & coaching e-commerce.',
		role: 'Built & operate'
	}
];
