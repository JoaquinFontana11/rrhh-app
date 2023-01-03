<script lang="ts">
	import { Icon, Trash } from 'svelte-hero-icons';
	import { fly } from 'svelte/transition';
	import filterStore from '$lib/stores/filterStore';

	export let fields: string[] = [];

	let field: string;
	let filter: string;
	let value: string | number | boolean;
	let simbols = {
		lt: '<',
		lte: '<=',
		eq: '=',
		gt: '>',
		gte: '>='
	};

	filterStore.subscribe((val) => {
		localStorage.setItem('filter', JSON.stringify(val));
	});
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg left-1/2 -translate-x-1/2 dark:bg-stone-800"
	transition:fly
>
	<label class="dark:text-stone-400">Campo</label>
	<select
		bind:value={field}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
	>
		{#each fields as field}
			<option>{field}</option>
		{/each}
	</select>
	<label class="dark:text-stone-400">Filtro</label>
	<select
		bind:value={filter}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
	>
		<option value="lt">menor a</option>
		<option value="lte">menor o igual a</option>
		<option value="eq">igual a</option>
		<option value="gt">mayor a</option>
		<option value="gte">mayor o igual a</option>
	</select>

	<label class="dark:text-stone-400">Valor</label>
	<input
		type="text"
		bind:value
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
	/>
	<button
		class="bg-lime-500 rounded-lg p-1"
		on:click={() => {
			filterStore.update((filterStoreValue) => {
				if (!value) return filterStoreValue;
				filterStoreValue = filterStoreValue.filter((f) => f.field !== field);

				filterStoreValue.push({
					field,
					filter,
					value
				});
				return filterStoreValue;
			});
		}}>Agregar filtro</button
	>

	<p class="dark:text-stone-400">Filtros activos</p>
	{#each $filterStore as filterValue}
		<div class="flex justify-between bg-lime-100 p-1 rounded-lg gap-2">
			<p class="flex justify-center grow gap-5">
				<span>
					{filterValue.field}
				</span>
				<span class="grow text-right">
					{simbols[filterValue.filter]}
				</span>
				<span>
					{filterValue.value}
				</span>
			</p>
			<button
				class="mr-2"
				on:click={() => {
					filterStore.update((filterStoreValue) => {
						return filterStoreValue.filter((f) => f.field !== filterValue.field);
					});
				}}
			>
				<Icon src={Trash} class="w-4 h-4 hover:text-stone-600" />
			</button>
		</div>
	{:else}
		<p class="dark:text-stone-400">No tenes ningun filtro activo 🧐</p>
	{/each}
</div>
