<script lang="ts">
	import { Plus, Refresh, ArrowLeft, ArrowRight, Filter, SortAscending } from 'svelte-hero-icons';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardTable from '$lib/components/Dashboard/DashboardTable.svelte';
	import Test from '$lib/components/Dashboard/TEST.svelte';
	import Test2 from '$lib/components/Dashboard/TEST2.svelte';
	import type { PageLoad } from './$types';

	export let data: PageLoad;

	let showDrawer = false;
	let drawerContent = Test;
	let page = 1;
	let lastPage = 10;

	const tableData = {
		headers: Object.entries(data.data[0]).map((entries) => entries[0]),
		fields: Object.entries(data.data[0]).map((entries) => entries[0]),
		data: data.data
	};

	console.log(tableData);
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
