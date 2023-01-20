<script lang="ts">
	import { fly } from 'svelte/transition';
	import { execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
	import { generateBlobExcel } from '$lib/exportExcel';
	import { generatePDF } from '$lib/exportPDF';
	import pageStore from '$lib/stores/pageStore';
	import orderStore from '$lib/stores/orderStore';
	import filterStore from '$lib/stores/filterStore';
	import showStore from '$lib/stores/showStore';
	import { cantPage } from '$lib/stores/pageStore';

	let exportType = 'all';
	let exportFormat = 'pdf';
	let filtersActive = false;
	let fieldsActive = false;

	const exportData = async () => {
		console.log(exportType, filtersActive, fieldsActive);

		// obtenemos los datos de supabase
		const resSupabase = await execSupabaseQuery(
			`supabase.from('agente').select('*, datosRecorrido (*), datosAcademicos (*), datosSalud (*), equipo (*),  direccion (*), superiorDirecto (*)')`,
			exportType == 'all' ? null : $pageStore,
			filtersActive ? $filterStore : [],
			$orderStore,
			$cantPage
		);

		let data = flatSupabaseResponse(resSupabase.data);
		//filtramos los campos
		if (fieldsActive) {
			data = data.map((agente) => {
				const newAgente = {};
				Object.entries(agente).forEach((entries) => {
					if ($showStore.some((show) => show.field == entries[0])) {
						entries[1] =
							entries[0] === 'equipo' ||
							entries[0] === 'direccion' ||
							entries[0] === 'superiorDirecto'
								? entries[1].value
								: entries[1];
						newAgente[entries[0]] = newAgente[entries[0]] = entries[1];
					}
				});
				return newAgente;
			});
		}

		if (exportFormat === 'pdf') {
			generatePDF(data);
		} else {
			// generamos el Blob del excel
			const blobExcel = await generateBlobExcel(data);

			// descargamos el blob
			window.location = URL.createObjectURL(blobExcel);
		}
	};
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg left-1/2 -translate-x-1/2 dark:bg-stone-800"
	transition:fly
>
	<label class="dark:text-stone-400">Tipo de exportacion</label>
	<select
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
		bind:value={exportType}
	>
		<option value="all">Exporar todos los agentes</option>
		<option value="page">Exportar la pagina actual</option>
	</select>
	<label class="dark:text-stone-400">Formato de exportacion</label>
	<select
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
		bind:value={exportFormat}
	>
		<option value="excel">Excel</option>
		<option value="pdf">Pdf</option>
	</select>
	<div class="flex items-center justify-between">
		<label class="dark:text-stone-400">Aplicar filtros</label>
		<input
			class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
			type="checkbox"
			bind:checked={filtersActive}
		/>
	</div>
	<div class="flex items-center justify-between">
		<label class="dark:text-stone-400">Aplicar campos</label>
		<input
			class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
			type="checkbox"
			bind:checked={fieldsActive}
		/>
	</div>
	<button class="bg-lime-500 rounded-lg p-1" on:click={exportData}>Exportar agentes</button>
</div>
