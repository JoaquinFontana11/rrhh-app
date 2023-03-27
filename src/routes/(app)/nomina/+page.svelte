<script lang="ts">
	import {
		Plus,
		Eye,
		EyeOff,
		Refresh,
		Filter as filterIcon,
		ArrowLeft,
		ArrowRight,
		SortAscending,
		SortDescending,
		Icon,
		Document
	} from 'svelte-hero-icons';
	/*
	import pageStore, { cantPage } from '$lib/stores/old_stores_delete/pageStore';
	import orderStore from '$lib/stores/old_stores_delete/orderStore';
	import filterStore from '$lib/stores/old_stores_delete/filterStore';
	import showStore from '$lib/stores/old_stores_delete/showStore';
	import { agenteStore } from '$lib/stores/old_stores_delete/agenteStore';
	import { showAllStore } from '$lib/stores/old_stores_delete/showStore';
*/
	import {
		pageStore,
		cantPageStore,
		orderStore,
		filterStore,
		showStore,
		agenteStore,
		showAllStore
	} from '$lib/stores/nominaStores';

	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardTable from '$lib/components/Dashboard/DashboardTable.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardToolbarOrder from '$lib/components/Dashboard/DashboardToolbarOrder.svelte';
	import DashboardToolbarFilter from '$lib/components/Dashboard/DashboardToolbarFilter.svelte';
	import DashboardToolbarShow from '$lib/components/Dashboard/DashboardToolbarShow.svelte';
	import DashboardToolbarExport from '$lib/components/Dashboard/DashboardToolbarExport.svelte';
	import FormDrawerAgente from '$lib/components/FormDrawer/FormDrawerAgente.svelte';
	import type { PageData } from './$types';
	import type { Filter } from '$lib/types';

	type TableData = {
		headers: string[];
		fields: string[];
		data: any[];
	};

	export let data: PageData;

	let lastPage = data.lastPage;
	let showDrawer = false;
	let tableData: TableData = {
		headers: [],
		fields: [],
		data: []
	};
	let stopLongPolling: Function;
	let intervalsIds: any[] = [];
	let showDropdowns = [false, false, false, false];

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
		filter: Filter[],
		cantPage: number
	) => {
		intervalsIds.push(
			setInterval(async () => {
				tableData = transformData((await data.reloadData(page, order, filter, cantPage)).data);
			}, 10000)
		);

		return () => intervalsIds.forEach((id) => clearInterval(id));
	};

	tableData = transformData(data.data);
	stopLongPolling = initLongPolling(0, $orderStore, $filterStore, $cantPageStore);
	data.fields = data.fields.filter((field) => {
		return field !== 'id' && field !== 'created_at' ? field : '';
	});

	// cuando se actualiza la pagina se vuelve a hacer la peticion y se reinicia el long polling
	pageStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData(
			(await data.reloadData(val, $orderStore, $filterStore, $cantPageStore)).data
		);
		stopLongPolling = initLongPolling(val, $orderStore, $filterStore, $cantPageStore);
	});
	// cuando se cambia el orden tambien se recarga la pagina
	orderStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData(
			(await data.reloadData($pageStore, val, $filterStore, $cantPageStore)).data
		);
		stopLongPolling = initLongPolling($pageStore, val, $filterStore, $cantPageStore);
	});
	// cuando se cambian los filtros tambien se recarga la pagina
	filterStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData(
			(await data.reloadData($pageStore, $orderStore, val, $cantPageStore)).data
		);
		stopLongPolling = initLongPolling($pageStore, $orderStore, val, $cantPageStore);
		const { count } = await data.calcLastPage($orderStore, val);
		lastPage = Math.trunc(count / $cantPageStore);
	});
	// cuando se cambian los campos a mostrar se recalcula tableData
	showStore.subscribe(async (val) => {
		tableData = transformData(
			(await data.reloadData($pageStore, $orderStore, $filterStore, $cantPageStore)).data
		);
	});
	showAllStore.subscribe(async (val) => {
		tableData = transformData(
			(await data.reloadData($pageStore, $orderStore, $filterStore, $cantPageStore)).data
		);
	});

	const changeCantPage = async (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const value = parseInt(target.value);

		cantPageStore.update((n) => value);
		stopLongPolling();
		tableData = transformData(
			(await data.reloadData($pageStore, $orderStore, $filterStore, value)).data
		);
		stopLongPolling = initLongPolling($pageStore, $orderStore, $filterStore, $cantPageStore);
		const { count } = await data.calcLastPage($orderStore, $filterStore);
		lastPage = Math.trunc(count / value);
	};
</script>

<Header />
<Dashboard bind:showDrawer drawerContent={FormDrawerAgente}>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarButton
			name="Exportar"
			icon={Document}
			dropdown={true}
			bind:showDropdown={showDropdowns[3]}
			on:click={() => {
				showDropdowns = showDropdowns.map((val, i) => (i == 3 ? val : false));
				showDropdowns[3] = !showDropdowns[3];
			}}
		>
			<DashboardToolbarExport slot="dropdown-content" />
		</DashboardToolbarButton>
		<DashboardToolbarButton
			name="Orden"
			icon={$orderStore.direction ? SortAscending : SortDescending}
			dropdown={true}
			bind:showDropdown={showDropdowns[0]}
			on:click={() => {
				showDropdowns = showDropdowns.map((val, i) => (i == 0 ? val : false));
				showDropdowns[0] = !showDropdowns[0];
			}}
		>
			<DashboardToolbarOrder slot="dropdown-content" fields={tableData.fields} />
		</DashboardToolbarButton>
		<DashboardToolbarButton
			name="Agregar filtro"
			icon={filterIcon}
			dropdown={true}
			bind:showDropdown={showDropdowns[1]}
			on:click={() => {
				showDropdowns = showDropdowns.map((val, i) => (i == 1 ? val : false));
				showDropdowns[1] = !showDropdowns[1];
			}}
			textHighlight={$filterStore.length !== 0}
		>
			<DashboardToolbarFilter slot="dropdown-content" fields={data.fields} />
		</DashboardToolbarButton>

		<DashboardToolbarButton
			name="Agregar Campo"
			icon={$showAllStore ? Eye : EyeOff}
			dropdown={true}
			bind:showDropdown={showDropdowns[2]}
			on:click={() => {
				showDropdowns = showDropdowns.map((val, i) => (i == 2 ? val : false));
				showDropdowns[2] = !showDropdowns[2];
			}}
		>
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
		<DashboardToolbarSelect
			options={[
				{ name: '10', value: 10 },
				{ name: '50', value: 50 },
				{ name: '100', value: 100 }
			]}
			value={10}
			on:input={changeCantPage}
		/>
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
					showDrawer = true;
				}}
				class="w-6 h-6 bg-DPMA-Turquoise flex justify-center items-center rounded-full m-2 dark:text-stone-900 hover:bg-light-Turquoise"
				><Icon src={Document} class="w-4 h-4" /></button
			></td
		>
	</DashboardTable>
</Dashboard>
