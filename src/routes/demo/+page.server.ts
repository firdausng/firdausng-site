import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ fetch, platform }: ServerLoadEvent) {
    await platform?.env.YOUR_KV_NAMESPACE.put(
        'test',
        'test');
    const test = await platform?.env.YOUR_KV_NAMESPACE.list();
    const MY_VARIABLE = platform?.env.MY_VARIABLE;
    console.log(test)
    return { 
        test,
        MY_VARIABLE
    }
}