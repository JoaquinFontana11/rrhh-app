<script lang="ts">
	import { goto } from '$app/navigation';
	import { Plus, Refresh, ArrowLeft, ArrowRight, Filter, SortAscending } from 'svelte-hero-icons';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardTable from '$lib/components/Dashboard/DashboardTable.svelte';
	import Test from '$lib/components/Dashboard/TEST.svelte';
	import Test2 from '$lib/components/Dashboard/TEST2.svelte';

	let showDrawer = false;
	let drawerContent = Test;
	let page = 1;
	let lastPage = 10;

	const tableData = {
		headers: ['campo1', 'campo2', 'campo3', 'campo4', 'campo5', 'campo6'],
		fields: ['campo1', 'campo2', 'campo3', 'campo4', 'campo5', 'campo6'],
		data: [
			{
				campo1: 'nombre 1',
				campo2: 'nombre 2',
				campo3: 'nombre 3',
				campo4: 'nombre 4',
				campo5: 'nombre 5',
				campo6: 'nombre 6'
			},
			{
				campo1: 'nombre 1',
				campo2: 'nombre 2',
				campo3: 'nombre 3',
				campo4: 'nombre 4',
				campo5: 'nombre 5',
				campo6: 'nombre 6'
			},
			{
				campo1: 'nombre 1',
				campo2: 'nombre 2',
				campo3: 'nombre 3',
				campo4: 'nombre 4',
				campo5: 'nombre 5',
				campo6: 'nombre 6'
			},
			{
				campo1: 'nombre 1',
				campo2: 'nombre 2',
				campo3: 'nombre 3',
				campo4: 'nombre 4',
				campo5: 'nombre 5',
				campo6: 'nombre 6'
			}
		]
	};
</script>

<Dashboard bind:showDrawer {drawerContent}>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarButton name="Orden" icon={SortAscending} />
		<DashboardToolbarButton name="Agregar filtro" icon={Filter} />
		<div class="flex gap-1 justify-center items-center">
			<DashboardToolbarButton
				name=""
				icon={ArrowLeft}
				on:click={() => {
					page = page == 0 ? page : page - 1;
				}}
			/>
			<p class="dark:text-stone-400">{page} / {lastPage}</p>
			<DashboardToolbarButton
				name=""
				icon={ArrowRight}
				on:click={() => {
					page = page == lastPage ? page : page + 1;
				}}
			/>
		</div>
		<DashboardToolbarButton name="" icon={Refresh} />
		<DashboardToolbarButton
			name="Agregar agente"
			highlight={true}
			icon={Plus}
			on:click={() => {
				drawerContent = Test;
				showDrawer = true;
			}}
		/>
	</div>
	<DashboardTable {tableData} slot="dashboard-content">
		<th
			slot="row-extra-header"
			class="h-8  bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300"
		/>

		<td
			slot="row-extra-cell"
			class=" dark:border-stone-800 dark:text-stone-400 border-t border-b border-r border-stone-100"
			let:rowData
			><button
				on:click={() => {
					console.log(rowData);
					drawerContent = Test2;
					showDrawer = true;
				}}>datos</button
			></td
		>
	</DashboardTable>
</Dashboard>
