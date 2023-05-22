<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let color: string = 'black';
	export let content: string;

	const distpach = createEventDispatcher();

	const onClick = (e: Event) => {
		distpach('click-item', { content });
	};
</script>

<div class="flex justify-start items-center gap-1 w-full">
	<button
		class="rounded-full w-2 h-2 bg-DPMA-Rose"
		class:red={color == 'red'}
		class:yellow={color == 'yellow'}
		class:sky={color == 'sky'}
		class:green={color == 'green'}
		class:indigo={color == 'indigo'}
		class:orange={color == 'orange'}
		on:click={onClick}
	/>
	<p class="text-sm font-light dark:text-stone-200">{content}</p>
</div>

<style lang="postcss">
	.red {
		@apply bg-DPMA-Rose;
	}
	.yellow {
		@apply bg-DPMA-Yellow;
	}
	.sky {
		@apply bg-sky-500;
	}
	.green {
		@apply bg-DPMA-Succes;
	}
	.indigo {
		@apply bg-indigo-500;
	}
	.orange {
		@apply bg-orange-500;
	}
</style>
