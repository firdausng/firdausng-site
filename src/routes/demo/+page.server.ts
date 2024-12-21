import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ fetch, platform }: ServerLoadEvent) {
    await platform?.env.KV_FROM_FIRDAUS.put(
        'test',
        'test');
    const test = await platform?.env.KV_FROM_FIRDAUS.list();
    const MY_VARIABLE = platform?.env.MY_VARIABLE;
    console.log(test)
    return { 
        test,
        MY_VARIABLE
    }
}