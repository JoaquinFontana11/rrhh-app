<script lang="ts">
	import { Icon, Trash } from 'svelte-hero-icons';
	import { fly } from 'svelte/transition';
	import { filterStore } from '$lib/stores/licenciaStore';
	import type { Filter } from '$lib/types';

	type Simbols = {
		lt: string;
		lte: string;
		eq: string;
		gt: string;
		gte: string;
		ilike: string;
	};

	export let fields: string[] = [];

	fields = fields.filter((field) => {
		return field !== 'id' && field !== 'created_at';
	});

	let field: string;
	let filter: 'lt' | 'lte' | 'eq' | 'gt' | 'gte' | 'ilike';
	let value: string | number | number[];
	let simbols: Simbols = {
		lt: '<',
		lte: '<=',
		eq: '=',
		gt: '>',
		gte: '>=',
		ilike: 'contiene'
	};

	filterStore.subscribe((val) => {
		localStorage.setItem('filter-licencia', JSON.stringify(val));
	});

	const filterField = (f: Filter) => {
		f.field !== field;
	};

	const getSimbol = (index: string) => simbols[index as keyof Simbols];
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg left-1/2 -translate-x-1/2 dark:bg-stone-800"
	transition:fly
>
	<label class="dark:text-stone-400" for="field">Campo</label>
	<select
		id="field"
		bind:value={field}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
	>
		{#each fields as field}
			<option>{field}</option>
		{/each}
	</select>
	<label class="dark:text-stone-400" for="filter">Filtro</label>
	<select
		id="filter"
		bind:value={filter}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
	>
		<option value="lt">menor a</option>
		<option value="lte">menor o igual a</option>
		<option value="eq">igual a</option>
		<option value="gt">mayor a</option>
		<option value="gte">mayor o igual a</option>
		<option value="ilike">contiene a</option>
	</select>

	<label class="dark:text-stone-400" for="value">Valor</label>
	<input
		id="value"
		type="text"
		bind:value
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
	/>
	<span class="text-stone-400 text-sm dark:text-stone-600">formato de fecha: yyyy-mm-dd</span>
	<button
		class="bg-lime-500 rounded-lg p-1"
		on:click={async () => {
			filterStore.update((filterStoreValue) => {
				if (!value) return filterStoreValue;
				filterStoreValue = filterStoreValue.filter(filterField);

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
					{getSimbol(filterValue.filter)}
				</span>
				<span>
					{filterValue.value}
				</span>
			</p>
			<button
				class="mr-2"
				on:click={() => {
					filterStore.update((filterStoreValue) => {
						return filterStoreValue.filter(filterField);
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
