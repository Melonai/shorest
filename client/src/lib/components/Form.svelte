<script lang="ts">
    import shorten from "$lib/actions/shorten";
    import { links } from "$lib/data/links";
    import checkUrl from "$lib/utils/checkUrl";
    import debounce from "$lib/utils/debounce";
    import ArrowIcon from "./icons/ArrowIcon.svelte";
    import CrossIcon from "./icons/CrossIcon.svelte";

    let value = "";
    let valid = false;

    function submit() {
        const url = checkUrl(value);
        if (url !== null) {
            links.add(shorten(url));
        }
    }

    const check = debounce(() => valid = !!checkUrl(value), 100);

    // @ts-ignore: Value is a dependency
    $: value, check();
</script>

<style>
    form {
        position: relative;
        border: 1px solid #aaaabb;
        box-shadow: 0 4px 6px #aaaabb30;
        box-sizing: border-box;
        border-radius: 5px;
    }

    .field {
        box-sizing: border-box;
        width: 100%;
        border: none;
        padding: 15px 50px 15px 20px;
        background: transparent;
        font-size: 1rem;
    }

    .button {
        position: absolute;
        right: 10px;
        margin: auto;
        top: 0;
        bottom: 0;
        background: transparent;
        border: none;
        cursor: pointer;
    }
</style>

<form on:submit|preventDefault={submit}>
    <input class="field" bind:value type="text"/>
    <button class="button" type="submit">
        {#if valid}
            <ArrowIcon/>
        {:else}
            <CrossIcon/>
        {/if}
    </button>
</form>
