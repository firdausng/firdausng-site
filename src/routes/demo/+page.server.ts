import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ fetch, platform }: ServerLoadEvent) {
    await platform?.env.YOUR_KV_NAMESPACE.put(
        'test',
        'test');
    const test = await platform?.env.YOUR_KV_NAMESPACE.list();
    const MY_VARIABLE = platform?.env.MY_VARIABLE;
    const my_secret = platform?.env.my_secret;
    console.log(test)
    return { 
        test,
        MY_VARIABLE,
        my_secret
    }
}