import type { ServerLoadEvent } from "@sveltejs/kit";
import {getPosts} from "$lib/utils/post.utils"

export async function load({ fetch }: ServerLoadEvent) {
    const posts: Post[] = await getPosts();
    const featuredPost = posts.filter(p => p.featured);
    const first3Posts = posts.slice(0, 3);
    
    return {
        featuredPost,
        first3Posts,
    }
}