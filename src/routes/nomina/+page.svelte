<script lang="ts">
	import {
		Plus,
		Eye,
		Refresh,
		ArrowLeft,
		ArrowRight,
		Filter,
		SortAscending
	} from 'svelte-hero-icons';
	import page from '$lib/stores/pageStore';
	import order from '$lib/stores/orderStore';
	import filter from '$lib/stores/filterStore';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardTable from '$lib/components/Dashboard/DashboardTable.svelte';
	import DashboardToolbarOrder from '$lib/components/Dashboard/DashboardToolbarOrder.svelte';
	import DashboardToolbarFilter from '$lib/components/Dashboard/DashboardToolbarFilter.svelte';
	import Test from '$lib/components/Dashboard/TEST.svelte';
	import Test2 from '$lib/components/Dashboard/TEST2.svelte';
	import type { PageLoad } from './$types';

	export let data: PageLoad;

	let lastPage = data.lastPage;
	let showDrawer = false;
	let drawerContent = Test;
	// TODO: definir bien el tipo
	let tableData: any = [];
	let stopLongPolling: any;
	let intervalsIds: any[] = [];

	const transformData = (data) => {
		return {
			headers: Object.entries(data[0]).map((entries) => entries[0]),
			fields: Object.entries(data[0]).map((entries) => entries[0]),
			data: data
		};
	};

	const initLongPolling = (page, order, filter) => {
		intervalsIds.push(
			setInterval(async () => {
				tableData = transformData((await data.reloadData(page, order, filter)).data);
			}, 10000)
		);

		return () => intervalsIds.forEach((id) => clearInterval(id));
	};

	tableData = transformData(data.data);
	stopLongPolling = initLongPolling(0, $order, $filter);

	// cuando se actualiza la pagina se vuelve a hacer la peticion y se reinicia el long polling
	page.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData((await data.reloadData(val, $order, $filter)).data);
		stopLongPolling = initLongPolling(val, $order, $filter);
	});
	// cuando se cambia el orden tambien se recarga la pagina
	order.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData((await data.reloadData($page, val, $filter)).data);
		stopLongPolling = initLongPolling($page, val, $filter);
	});
	// cuando se cambian los filtros tambien se recarga la pagina
	filter.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData((await data.reloadData($page, $order, val)).data);
		stopLongPolling = initLongPolling($page, $order, val);
		const { count } = await data.reloadLastPage($order, val);
		lastPage = Math.trunc(count / 10) - 1;
	});
</script>

<Dashboard bind:showDrawer {drawerContent}>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarButton name="Orden" icon={SortAscending} dropdown={true}>
			<DashboardToolbarOrder slot="dropdown-content" fields={tableData.fields} />
		</DashboardToolbarButton>
		<DashboardToolbarButton name="Agregar filtro" icon={Filter} dropdown={true}>
			<DashboardToolbarFilter slot="dropdown-content" fields={tableData.fields} />
		</DashboardToolbarButton>

		<DashboardToolbarButton name="Agregar Campo" icon={Eye} />
		<div class="flex gap-1 justify-center items-center">
			<DashboardToolbarButton
				name=""
				icon={ArrowLeft}
				on:click={() => {
					page.update((n) => (n == 0 ? n : n - 1));
				}}
			/>
			<p class="dark:text-stone-400">{$page} / {lastPage}</p>
			<DashboardToolbarButton
				name=""
				icon={ArrowRight}
				on:click={() => {
					page.update((n) => (n == lastPage ? n : n + 1));
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
