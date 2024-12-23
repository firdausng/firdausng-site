import type { ServerLoadEvent } from "@sveltejs/kit";
import {getPostTags} from "$lib/utils/post.utils"

export async function load({ fetch }: ServerLoadEvent) {
    const posts = await getPostTags();
    return { posts }
}