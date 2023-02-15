<script lang="ts">
	import { fly } from 'svelte/transition';
	import { execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
	import { generateBlobExcel } from '$lib/exportExcel';
	import { generatePDF } from '$lib/exportPDF';

	import {
		pageStore,
		orderStore,
		filterStore,
		showStore,
		cantPageStore
	} from '$lib/stores/nominaStores';
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import type { Agente, AgenteSupabase } from '$lib/types';
	let exportType = 'all';
	let exportFormat = 'pdf';
	let filtersActive = false;
	let fieldsActive = false;
	let title: string;
	let subtitle: string;

	let disabled: boolean;

	$: disabled = title === '' || subtitle === '' || title === undefined || subtitle === undefined;

	const exportData = async () => {
		// obtenemos los datos de supabase
		const resSupabase: PostgrestResponse<AgenteSupabase> = await execSupabaseQuery(
			`supabase.from('agente').select('*, datosRecorrido (*), datosAcademicos (*), datosSalud (*), equipo (*),  direccion (*), superiorDirecto (*)')`,
			exportType == 'all' ? null : $pageStore,
			filtersActive ? $filterStore : [],
			$orderStore,
			$cantPageStore
		);

		if (!resSupabase.data) return;

		let data = flatSupabaseResponse(resSupabase.data);
		//filtramos los campos
		if (fieldsActive) {
			data = data.map((agente: any) => {
				const newAgente: { [key: string]: any } = {};
				Object.entries(agente).forEach((entries: any) => {
					if ($showStore.some((show) => show.field == entries[0])) {
						if (
							entries[0] === 'equipo' ||
							entries[0] === 'direccion' ||
							entries[0] === 'superiorDirecto'
						)
							entries[1] = entries[1].value;

						newAgente[entries[0]] = entries[1];
					}
				});
				return newAgente;
			});
		}

		if (exportFormat === 'pdf') {
			generatePDF(data, title, subtitle);
		} else {
			// generamos el Blob del excel
			const blobExcel = await generateBlobExcel(data);

			// descargamos el blob
			window.location.href = URL.createObjectURL(blobExcel);
		}
	};
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg left-1/2 -translate-x-1/2 dark:bg-stone-800"
	transition:fly
>
	<label class="dark:text-stone-400" for="tipo">Tipo de exportacion</label>
	<select
		id="tipo"
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
		bind:value={exportType}
	>
		<option value="all">Exporar todos los agentes</option>
		<option value="page">Exportar la pagina actual</option>
	</select>
	<label class="dark:text-stone-400" for="formato">Formato de exportacion</label>
	<select
		id="formato"
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
		bind:value={exportFormat}
	>
		<option value="excel">Excel</option>
		<option value="pdf">Pdf</option>
	</select>
	<div class="flex items-center justify-between">
		<label class="dark:text-stone-400" for="filtros">Aplicar filtros</label>
		<input
			id="filtros"
			class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
			type="checkbox"
			bind:checked={filtersActive}
		/>
	</div>
	<div class="flex items-center justify-between">
		<label class="dark:text-stone-400" for="campos">Aplicar campos</label>
		<input
			id="campos"
			class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
			type="checkbox"
			bind:checked={fieldsActive}
		/>
	</div>
	{#if exportFormat == 'pdf'}
		<label class="dark:text-stone-400" for="titulo">Titulo del documento</label>
		<input
			id="titulo"
			class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
			type="text"
			bind:value={title}
		/>
		<label class="dark:text-stone-400" for="subtitulo">Subtitulo del documento</label>
		<input
			id="subtitulo"
			class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
			type="text"
			bind:value={subtitle}
		/>
	{/if}
	<button class="bg-lime-500 rounded-lg p-1" class:disabled {disabled} on:click={exportData}
		>Exportar agentes</button
	>
</div>

<style lang="postcss">
	.disabled {
		@apply bg-lime-300 cursor-not-allowed;
	}
</style>
