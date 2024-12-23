import type { ServerLoadEvent } from "@sveltejs/kit";
import {getPosts} from "$lib/utils/post.utils"

export async function load({ fetch }: ServerLoadEvent) {
    const posts: Post[] = await getPosts();
    return { posts }
}