// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
    interface Platform {
        env: {
			KV_FROM_FIRDAUS: KVNamespace;
            YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
			MY_VARIABLE: string
        }
        cf: CfProperties
        ctx: ExecutionContext
    }
}

interface Post {
	title: string
	slug: string
	description: string
	image?: string
	date: string
	categories: string[]
	published: boolean
}

interface BlogComment {
	name: string
	avatar: string
	content: string
	createdAt: string
}

