<script lang="ts">
	import { watchResize } from 'svelte-watch-resize';

	type TableData = {
		headers: string[];
		fields: string[];
		data: { [key: string]: any }[];
	};

	// TODO: crear un tipo para la clase de data que recibe la tabla
	export let tableData: TableData = {
		headers: [],
		fields: [],
		data: []
	};
	// ancho de cada columna
	let sizes = tableData.headers.map((e: string) => 40);

	const headerResize = (node: HTMLElement) => {
		sizes[tableData.headers.findIndex((e: string) => e == node.textContent)] = node.clientWidth;
	};

	const formatSomeValues = (data: { [key: string]: any }, key: string): string => {
		const value: any = data[key];

		if (key == 'equipo' || key == 'direccion' || key == 'superiorDirecto') {
			return value;
		}

		if (typeof value == 'boolean') return value == true ? 'Si' : 'No';

		return value == null ? '' : value;
	};
</script>

<table class="overflow-auto">
	<thead>
		<slot name="row-extra-header" />
		{#each tableData.headers as header}
			{#if header !== 'id' && header !== 'created_at'}
				<th
					class="h-8  w-10 bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
				>
					<p class="p-2 resize-x block overflow-auto" use:watchResize={headerResize}>
						{header}
					</p>
				</th>
			{/if}
		{/each}
	</thead>
	<tbody>
		{#each tableData.data as data}
			<tr class="min-h-8 h-auto text-center">
				<!-- Aca uso las props de los slot para que el componente que llene esto sepa que dato maneja-->
				<slot name="row-extra-cell" rowData={data} />
				{#each tableData.fields as field, i}
					{#if field !== 'id' && field !== 'created_at'}
						<td
							class="border border-stone-100 dark:border-stone-800 dark:text-stone-400 text-elipsis overflow-hidden w-10"
							style={`${i == 0 || i == tableData.fields.length ? 'border-left: 0px' : ''}`}
						>
							<p class={`truncate p-2`} style={`width: ${sizes[i]}px;`}>
								{formatSomeValues(data, field)}
							</p>
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
