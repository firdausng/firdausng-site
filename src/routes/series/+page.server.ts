import type { ServerLoadEvent } from "@sveltejs/kit";
import {getSeries} from "$lib/utils/series.utils";

export async function load({ fetch }: ServerLoadEvent) {
    const series: Post[] = await getSeries();
    return { series }
}