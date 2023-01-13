<script lang="ts">
	import { fly } from 'svelte/transition';

	let exportType = 'all';
	let exportFormat = 'pdf';
	let filtersActive = false;
	let fieldsActive = false;

	const exportData = async () => {
		const body = new FormData();
		body.set('type', exportType);
		body.set('format', exportFormat);
		body.set('filters', filtersActive + '');
		body.set('fields', fieldsActive + '');

		const res = await fetch('?/exportAgentesExcel', {
			method: 'POST',
			body
		});
		const data = await res.json();

		const blob = b64toBlob(JSON.parse(data.data)[1]);

		window.location = URL.createObjectURL(blob);
	};

	const b64toBlob = (b64, sliceSize = 512) => {
		const byteCharacters = atob(b64);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		return blob;
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
