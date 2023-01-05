<script lang="ts">
	import { Icon, ChevronDown } from 'svelte-hero-icons';
	export let validate: boolean;
	export let label: string;
	console.log(validate);
</script>

<button
	on:click
	class="flex justify-between w-full p-2 items-center dark:text-stone-400"
	type="button"
	><span>
		{label}
	</span>
	<div class="flex gap-1 justify-center items-center">
		{#if !validate}
			<div class="w-2 h-2 bg-rose-500 rounded-full" />
		{/if}
		<Icon src={ChevronDown} class="pl-2 w-7 h-7  " />
	</div>
</button>
