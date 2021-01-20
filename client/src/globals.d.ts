/// <reference types="@sveltejs/kit" />

//#region Ensure Svelte file endings have a type for TypeScript
declare module '*.svelte' {
	export { SvelteComponent as default } from 'svelte';
}
//#endregion

//#region Ensure image file endings have a type for TypeScript
declare module "*.gif" {
	const value: string;
	export = value;
}

declare module "*.jpg" {
	const value: string;
	export = value;
}

declare module "*.jpeg" {
	const value: string;
	export = value;
}

declare module "*.png" {
	const value: string;
	export = value;
}

declare module "*.svg" {
	const value: string;
	export = value;
}

declare module "*.webp" {
	const value: string;
	export = value;
}
//#endregion
