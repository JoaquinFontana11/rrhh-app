<script lang="ts">
	import { Icon, ChevronDown } from 'svelte-hero-icons';
	export let validate: boolean;
	export let dropdown: any;
	export let label: string;
</script>

<button
	class={' w-[60%] text-stone-700 bg-white hover:bg-stone-100 focus:outline-none font-medium rounded-lg text-base px-10 py-1.5 text-center inline-flex items-center dark:bg-stone-900 dark:hover:bg-stone-800 border-2 border-stone-700 dark:text-stone-300 dark:border-stone-300 mb-2'}
	class:invalid={!validate}
	on:click={dropdown}
	>{label}
	<Icon src={ChevronDown} class="pl-2 w-7 h-7 absolute right-24 " />
</button>

<style lang="postcss">
	.invalid {
		@apply border-red-700 text-red-700;
	}
</style>
