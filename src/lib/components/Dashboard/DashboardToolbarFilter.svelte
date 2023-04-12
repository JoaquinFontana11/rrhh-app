<script lang="ts">
	import { Icon, Trash } from 'svelte-hero-icons';
	import { fly } from 'svelte/transition';
	import { filterStore } from '$lib/stores/nominaStores';
	import { supabase, execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
	import type { Filter } from '$lib/types';
	import type { PostgrestResponse } from '@supabase/supabase-js';

	type Simbols = {
		[key: string]: string;
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
	let value: string | number;
	let simbols: Simbols = {
		lt: '<',
		lte: '<=',
		eq: '=',
		gt: '>',
		gte: '>=',
		ilike: 'contiene'
	};

	filterStore.subscribe((val) => {
		localStorage.setItem('filter', JSON.stringify(val));
	});

	const filterField = (field: string) => (f: Filter) => f.field !== field;

	const searchId = async (table: string, column: string, value: string | number | boolean) => {
		let res: PostgrestResponse<any> = await supabase
			.from(table)
			.select('id')
			.eq(column, value)
			.range(0, 1);

		if (!res.data) return;
		return res.data[0] ? res.data[0].id : -1;
	};
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg left-1/2 -translate-x-1/2 dark:bg-stone-800"
	transition:fly
>
	<label class="dark:text-stone-400" for="campo">Campo</label>
	<select
		id="campo"
		bind:value={field}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
	>
		{#each fields as field}
			<option>{field}</option>
		{/each}
	</select>
	<label class="dark:text-stone-400" for="filtro">Filtro</label>
	<select
		id="filtro"
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

	<label class="dark:text-stone-400" for="valor">Valor</label>
	<input
		id="valor"
		type="text"
		bind:value
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
	/>
	<span class="text-stone-400 text-sm dark:text-stone-600">formato de fecha: yyyy-mm-dd</span>
	<button
		class="bg-lime-500 rounded-lg p-1"
		on:click={async () => {
			if (field === 'equipo' || field === 'direccion' || field === 'superiorDirecto') {
				const column =
					field === 'equipo' ? 'equipo' : field === 'direccion' ? 'acronimo' : 'nombreCompleto';
				value = await searchId(field === 'superiorDirecto' ? 'agente' : field, column, value);
			}
			filterStore.update((filterStoreValue) => {
				if (!value) return filterStoreValue;
				filterStoreValue = filterStoreValue.filter(filterField(field));
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
						return filterStoreValue.filter(filterField(filterValue.field));
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
