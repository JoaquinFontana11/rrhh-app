<script lang="ts">
	import { fly } from 'svelte/transition';
	import { orderStore } from '$lib/stores/nominaStores';

	export let fields: string[] = [];
	let field: string = $orderStore.field;
	let direction: boolean = $orderStore.direction;

	orderStore.subscribe((val) => {
		localStorage.setItem('order', JSON.stringify(val));
	});
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg left-1/2 -translate-x-1/2 dark:bg-stone-800"
	transition:fly
>
	{#if !$orderStore}
		no tenes orden
	{/if}

	<label class="dark:text-stone-400" for="campo">Campo</label>
	<select
		id="campo"
		bind:value={field}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
	>
		{#each fields as field}
			<option>{field}</option>
		{/each}
	</select>
	<label class="dark:text-stone-400" for="orden">Orden</label>
	<select
		id="orden"
		bind:value={direction}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
	>
		<option value={true}>ascendente</option>
		<option value={false}>descendente</option>
	</select>
	<button
		class="bg-DPMA-Rose rounded-lg p-1"
		on:click={() => {
			orderStore.update((n) => {
				return {
					field,
					direction
				};
			});
		}}>Ordenar</button
	>
</div>
