<script lang="ts">
	import { type IconSource, Icon } from 'svelte-hero-icons';
	import { clickOutside } from '$lib/clickOutside';

	export let name: string = 'btn';
	export let icon: IconSource;
	export let highlight: boolean = false;
	export let textHighlight: boolean = false;
	export let dropdown: boolean = false;
	export let showDropdown: boolean = false;

	const handleClickOutside = (e: any) => {
		showDropdown = false;
	};
</script>

{#if !dropdown}
	<button
		class={`
	 p-1 text-sm rounded-md flex gap-2 justify-center items-center ${
			highlight ? 'dark:text-stone-900' : 'dark:text-stone-400 dark:hover:text-stone-200'
		}`}
		class:highligth={highlight}
		on:click><Icon src={icon} class="w-4 h-4" /> {name}</button
	>
{:else}
	<div class="relative" use:clickOutside on:click_outside={handleClickOutside}>
		<button
			class={`
	 p-1 text-sm rounded-md flex gap-2 justify-center items-center ${
			highlight ? 'dark:text-stone-900' : 'dark:text-stone-400 dark:hover:text-stone-200'
		}`}
			class:highligth={highlight}
			class:text-highligth={textHighlight}
			id="toolbarButton"
			on:click><Icon src={icon} class="w-4 h-4" /> {name}</button
		>
		{#if showDropdown}
			<slot name="dropdown-content" />
		{/if}
	</div>
{/if}

<style lang="postcss">
	.highligth {
		@apply bg-DPMA-Rose hover:bg-dark-Rose;
	}
	.text-highligth {
		@apply text-lime-500 hover:text-lime-600;
	}
</style>
