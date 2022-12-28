<script lang="ts">
	// TODO: crear un tipo para la clase de data que recibe la tabla
	export let tableData: any = {};
</script>

<table class="w-full ">
	<thead>
		<slot name="row-extra-header" />
		{#each tableData.headers as header}
			<th class="h-8 bg-stone-100">{header}</th>
		{/each}
	</thead>
	<tbody>
		{#each tableData.data as data}
			<tr class="h-8 text-center ">
				<!-- Aca uso las props de los slot para que el componente que llene esto sepa que dato maneja-->
				<slot name="row-extra-cell" rowData={data} />
				{#each tableData.fields as field, i}
					<td
						class="border border-stone-100"
						style={`${i == 0 || i == tableData.fields.length ? 'border-left: 0px' : ''}`}
						>{data[field]}</td
					>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
