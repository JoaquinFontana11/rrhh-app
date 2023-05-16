<script lang="ts">
	import { fly } from 'svelte/transition';
	import { execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
	import { generateBlobExcel } from '$lib/exportExcel';
	import { generatePDF } from '$lib/exportPDF';
	import { tipoLicenciaStore, filterStore } from '$lib/stores/licenciaStore';
	import pageLicenciaStore, { cantLicenciaPage } from '$lib/stores/licencias_old/pageLicenciaStore';
	// import {
	// 	pageStore,
	// 	orderStore,
	// 	filterStore,
	// 	showStore,
	// 	cantPageStore
	// } from '$lib/stores/NominaStores';
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import type { Agente, AgenteSupabase } from '$lib/types';
	export let manageFilters: Function;
	let exportType = 'all';
	let exportFormat = 'pdf';
	let filtersActive = false;
	let title: string;
	let subtitle: string;

	const fields = {
		fechaInicio: 'Fecha de Inicio',
		fechaFin: 'Fecha de Fin',
		tipo: 'Tipo',
		observaciones: 'Observaciones',
		autorizadoSiape: 'Autorizado Siape',
		nombreCompleto: 'Nombre Completo',
		acronimo: 'Acronimo',
		equipo: 'Equipo',
		direccion: 'Direccion',
		ultimaMateria: 'Ultima Materia',
		concepto: 'Concepto',
		mailAutorizado: ' Mail Autorizado',
		comunicacionInicio: 'Comunico Inicio',
		comunicoInicioA: 'Comunico Inicio A',
		comunicacionFin: 'Comunico Fin',
		comunicoFinA: 'Comunico Fin A',
		conectadoATeams: 'Conectado A Teams',
		periodo: 'Periodo'
	};

	const exportData = async () => {
		// obtenemos los datos de supabase
		const query = `supabase.from('licencia').select('fechaInicio, fechaFin, tipo, observaciones, autorizadoSiape, agente(nombreCompleto,direccion(acronimo),equipo(equipo))${
			$tipoLicenciaStore == 'academica'
				? ', datosAcademicos(ultimaMateria)'
				: $tipoLicenciaStore == 'salud'
				? ', datosSalud(concepto)'
				: $tipoLicenciaStore == 'teletrabajo'
				? ', datosTeletrabajo(mailAutorizado,comunicacionInicio,comunicoInicioA(nombreCompleto),comunicacionFin,comunicoFinA(nombreCompleto),conectadoATeams)'
				: $tipoLicenciaStore == 'vacaciones'
				? ', datosVacaciones(periodo)'
				: ''
		}').neq('borrado', true)`;
		const resSupabase: PostgrestResponse<AgenteSupabase> = await execSupabaseQuery(
			query,
			exportType == 'all' ? null : $pageLicenciaStore,
			filtersActive
				? await manageFilters([
						...$filterStore,
						{ field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }
				  ])
				: [{ field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			{ field: 'fechaInicio', direction: true },
			$cantLicenciaPage
		);

		if (!resSupabase.data) return;

		let data = flatSupabaseResponse(resSupabase.data);

		data = data.map((agente: any) => {
			const newAgente: { [key: string]: any } = {};
			Object.entries(agente).forEach((entries: any[]) => {
				if (
					entries[0] === 'equipo' ||
					entries[0] === 'direccion' ||
					entries[0] === 'superiorDirecto'
				)
					entries[1] = entries[1].value;

				if (entries[0] === 'comunicoInicioA' || entries[0] === 'comunicoFinA')
					entries[1] = entries[1].nombreCompleto;

				newAgente[fields[entries[0]]] = entries[1];
			});
			return newAgente;
		});

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
		<option value="all">Exportar todas las licencias</option>
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
	<button class="bg-lime-500 rounded-lg p-1" on:click={exportData}>Exportar licencias</button>
</div>
