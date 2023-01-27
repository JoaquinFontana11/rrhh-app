<script lang="ts">
	export let color: string = 'black';
	export let content: string;
</script>

<div class="flex justify-start items-center gap-1 w-full">
	<div
		class="rounded-full w-2 h-2 bg-rose-500"
		class:red={color == 'red'}
		class:yellow={color == 'yellow'}
		class:sky={color == 'sky'}
		class:green={color == 'green'}
		class:indigo={color == 'indigo'}
		class:orange={color == 'orange'}
	/>
	<p class="text-sm font-light dark:text-stone-200">{content}</p>
</div>

<style lang="postcss">
	.red {
		@apply bg-rose-500;
	}
	.yellow {
		@apply bg-yellow-500;
	}
	.sky {
		@apply bg-sky-500;
	}
	.green {
		@apply bg-green-500;
	}
	.indigo {
		@apply bg-indigo-500;
	}
	.orange {
		@apply bg-orange-500;
	}
</style>
