<script lang="ts">
    import Response from "./Response.svelte"
    import { slide } from 'svelte/transition';
    import { links } from "$data/links";
</script>

<style>
    ul {
        list-style: none;
        padding: 0 10px;
    }

    li {
        margin-bottom: 10px;
    }
</style>

<ul>
    {#each $links as info (info.nonce)}
        <li transition:slide >
            <Response {info}/>
        </li>
    {/each}
</ul>