import type { ShortenRequest } from "$lib/actions/shorten";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

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
