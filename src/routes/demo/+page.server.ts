import type { ServerLoadEvent } from "@sveltejs/kit";
import {getPlatformProxy} from "wrangler";

export async function load({ fetch }: ServerLoadEvent) {
    // @ts-ignore
    let platform: Platform = await getPlatformProxy();
    await platform.env.YOUR_KV_NAMESPACE.put(
        'test',
        'test');
    const test = await platform.env.YOUR_KV_NAMESPACE.list()
    console.log(test)
    return { 
        test
    }
}