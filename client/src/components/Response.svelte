<script lang="ts">
    import type { ShortenRequest } from "$actions/shorten";

    export let info: ShortenRequest;
</script>

<style>
    div {
        display: flex;
        justify-content: space-between;
    }

    .url {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .output {
        margin-left: 50px;
    }
</style>

<div>
    <span class="url">{info.url}</span>
    {#await info.response}
        <span class="output">Loading...</span>
    {:then { hash }} 
        <a class="output" href="https://sho.rest/{hash}">sho.rest/{hash}</a>
    {:catch { error }}
        <span class="output">{error}</span>
    {/await}
</div>