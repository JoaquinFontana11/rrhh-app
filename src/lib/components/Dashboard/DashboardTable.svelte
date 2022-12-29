<script lang="ts">
	// TODO: crear un tipo para la clase de data que recibe la tabla
	export let tableData: any = {};
</script>

<table class="overflow-auto">
	<thead>
		<slot name="row-extra-header" />
		{#each tableData.headers as header}
			<th
				class="h-8  w-10 bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
				><p class="p-2 resize-x block overflow-auto">
					{header}
				</p>
			</th>
		{/each}
	</thead>
	<tbody>
		{#each tableData.data as data}
			<tr class="min-h-8 h-auto text-center">
				<!-- Aca uso las props de los slot para que el componente que llene esto sepa que dato maneja-->
				<slot name="row-extra-cell" rowData={data} />
				{#each tableData.fields as field, i}
					<td
						class="border border-stone-100 dark:border-stone-800 dark:text-stone-400 text-elipsis overflow-hidden"
						style={`${i == 0 || i == tableData.fields.length ? 'border-left: 0px' : ''}`}
					>
						{data[field]}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
