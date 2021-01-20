import type { ShortenRequest } from "$actions/shorten";
import { Writable, writable } from "svelte/store";

function createLinks() {
    const { subscribe, update }: Writable<ShortenRequest[]> = writable([]);

    function add(request: ShortenRequest) {
        update((l) => [request, ...l.slice(0, 2)]);
    }

    return {
        subscribe,
        add,
    };
}

export const links = createLinks();
