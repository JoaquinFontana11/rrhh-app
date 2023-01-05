<script lang="ts">
	import {
		Plus,
		Eye,
		Refresh,
		ArrowLeft,
		ArrowRight,
		Filter,
		SortAscending,
		Icon,
		Document
	} from 'svelte-hero-icons';
	import pageStore from '$lib/stores/pageStore';
	import orderStore from '$lib/stores/orderStore';
	import filterStore from '$lib/stores/filterStore';
	import showStore from '$lib/stores/showStore';
	import { agenteStore } from '$lib/stores/agenteStore';
	import { showAllStore } from '$lib/stores/showStore';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardTable from '$lib/components/Dashboard/DashboardTable.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardToolbarOrder from '$lib/components/Dashboard/DashboardToolbarOrder.svelte';
	import DashboardToolbarFilter from '$lib/components/Dashboard/DashboardToolbarFilter.svelte';
	import DashboardToolbarShow from '$lib/components/Dashboard/DashboardToolbarShow.svelte';
	import type { PageData } from './$types';
	import FormDrawerAgente from '$lib/components/FormDrawer/FormDrawerAgente.svelte';

	export let data: PageData;

	let lastPage = data.lastPage;
	let showDrawer = false;
	// TODO: definir bien el tipo
	let tableData: any = [];
	let stopLongPolling: any;
	let intervalsIds: any[] = [];

	const transformData = (data: any[]) => {
		if (!data) return { headers: [], fields: [], data: [] };
		if (data.length == 0) return { headers: [], fields: [], data: [] };
		return {
			headers: Object.entries(data[0])
				.map((entries) => entries[0])
				.filter(
					(header) =>
						$showStore.some((fieldAllow: { field: string }) => fieldAllow.field == header) ||
						$showAllStore
				),
			fields: Object.entries(data[0])
				.map((entries) => entries[0])
				.filter(
					(header) =>
						$showStore.some((fieldAllow: { field: string }) => fieldAllow?.field == header) ||
						$showAllStore
				),
			data: data
		};
	};

	const initLongPolling = (
		page: number,
		order: { field: string; direction: boolean },
		filter: { field: string; filter: string; value: string }[]
	) => {
		intervalsIds.push(
			setInterval(async () => {
				tableData = transformData((await data.reloadData(page, order, filter)).data);
			}, 10000)
		);

		return () => intervalsIds.forEach((id) => clearInterval(id));
	};

	tableData = transformData(data.data);
	stopLongPolling = initLongPolling(0, $orderStore, $filterStore);

	// cuando se actualiza la pagina se vuelve a hacer la peticion y se reinicia el long polling
	pageStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData((await data.reloadData(val, $orderStore, $filterStore)).data);
		stopLongPolling = initLongPolling(val, $orderStore, $filterStore);
	});
	// cuando se cambia el orden tambien se recarga la pagina
	orderStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData((await data.reloadData($pageStore, val, $filterStore)).data);
		stopLongPolling = initLongPolling($pageStore, val, $filterStore);
	});
	// cuando se cambian los filtros tambien se recarga la pagina
	filterStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData((await data.reloadData($pageStore, $orderStore, val)).data);
		stopLongPolling = initLongPolling($pageStore, $orderStore, val);
		const { count } = await data.calcLastPage($orderStore, val);
		lastPage = Math.trunc(count / 10);
	});
	// cuando se cambian los campos a mostrar se recalcula tableData
	showStore.subscribe(async (val) => {
		tableData = transformData((await data.reloadData($pageStore, $orderStore, $filterStore)).data);
	});
	showAllStore.subscribe(async (val) => {
		tableData = transformData((await data.reloadData($pageStore, $orderStore, $filterStore)).data);
	});
</script>

<Dashboard bind:showDrawer drawerContent={FormDrawerAgente}>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarButton name="Orden" icon={SortAscending} dropdown={true}>
			<DashboardToolbarOrder slot="dropdown-content" fields={tableData.fields} />
		</DashboardToolbarButton>
		<DashboardToolbarButton name="Agregar filtro" icon={Filter} dropdown={true}>
			<DashboardToolbarFilter slot="dropdown-content" fields={data.fields} />
		</DashboardToolbarButton>

		<DashboardToolbarButton name="Agregar Campo" icon={Eye} dropdown={true}>
			<DashboardToolbarShow slot="dropdown-content" fields={data.fields} />
		</DashboardToolbarButton>
		<div class="flex gap-1 justify-center items-center">
			<DashboardToolbarButton
				name=""
				icon={ArrowLeft}
				on:click={() => {
					pageStore.update((n) => (n == 0 ? n : n - 1));
				}}
			/>
			<p class="dark:text-stone-400">{$pageStore} / {lastPage}</p>
			<DashboardToolbarButton
				name=""
				icon={ArrowRight}
				on:click={() => {
					pageStore.update((n) => (n == lastPage ? n : n + 1));
				}}
			/>
		</div>
		<DashboardToolbarButton name="" icon={Refresh} />
		<DashboardToolbarButton
			name="Agregar agente"
			highlight={true}
			icon={Plus}
			on:click={() => {
				agenteStore.update((n) => {
					return {};
				});
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
					agenteStore.update((n) => rowData);

					console.log(rowData);
					showDrawer = true;
				}}
				class="w-6 h-6 bg-lime-500 flex justify-center items-center rounded-full m-2 dark:text-stone-900 hover:bg-lime-400"
				><Icon src={Document} class="w-4 h-4" /></button
			></td
		>
	</DashboardTable>
</Dashboard>
