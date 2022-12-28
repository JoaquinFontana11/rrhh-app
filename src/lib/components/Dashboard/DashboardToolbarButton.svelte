<script lang="ts">
	import { type IconSource, Icon } from 'svelte-hero-icons';

	export let name: string = 'btn';
	export let icon: IconSource;
	export let highlight: boolean = false;
</script>

<button
	class={`
	 p-1 text-sm rounded-md flex gap-2 justify-center items-center ${
			highlight ? 'dark:text-stone-900' : 'dark:text-stone-400 dark:hover:text-stone-200'
		}`}
	class:highligth={highlight}
	on:click><Icon src={icon} class="w-4 h-4" /> {name}</button
>

<style lang="postcss">
	.highligth {
		@apply bg-lime-500 hover:bg-lime-600;
	}
</style>
