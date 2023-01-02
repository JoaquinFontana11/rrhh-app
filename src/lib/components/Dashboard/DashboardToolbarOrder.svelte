<script lang="ts">
	import { fly } from 'svelte/transition';
	import orderStore from '$lib/stores/orderStore';

	export let fields: string[] = [];
	let field: string = $orderStore.field;
	let direction: string = $orderStore.direction;

	orderStore.subscribe((val) => {
		localStorage.setItem('order', JSON.stringify(val));
	});
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg left-1/2 -translate-x-1/2"
	transition:fly
>
	{#if !$orderStore}
		no tenes orden
	{/if}

	<label>Campo</label>
	<select bind:value={field} class="bg-white border border-stone-200 rounded-lg outline-none p-1">
		{#each fields as field}
			<option>{field}</option>
		{/each}
	</select>
	<label>Orden</label>
	<select
		bind:value={direction}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1"
	>
		<option value={true}>ascendente</option>
		<option value={false}>descendente</option>
	</select>
	<button
		class="bg-lime-500 rounded-lg p-1"
		on:click={orderStore.update((n) => {
			return {
				field,
				direction
			};
		})}>Ordenar</button
	>
</div>
