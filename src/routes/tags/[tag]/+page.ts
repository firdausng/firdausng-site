import {error, type ServerLoadEvent} from "@sveltejs/kit"
import {getPostTags} from "$lib/utils/post.utils";

export const load = async ({ params }: ServerLoadEvent) => {
    const posts = await getPostTags();
    const tag = params.tag;
    if(!tag){
        throw error(404, `Could not find ${params.slug}`)
    }
    return { posts: posts[tag] }
}