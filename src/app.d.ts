// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		kv: KVNamespace; // Your type here
	}
	// interface PageData {}
	// interface Error {}
    interface Platform {
        env: {
			YOUR_KV_NAMESPACE: KVNamespace;
            YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
			MY_VARIABLE: string
			my_secret: string
        }
        cf: CfProperties
        ctx: ExecutionContext
    }
}

interface Post {
	title: string
	author: string
	slug: string
	description: string
	image?: string
	date: string
	categories?: string[]
	published: boolean
	featured?: boolean
}

interface CategoryPosts {
	[category: string]: Post[]
}

interface BlogComment {
	name: string
	avatar: string
	content: string
	createdAt: string
}

