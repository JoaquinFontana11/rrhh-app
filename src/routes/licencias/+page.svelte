<script lang="ts">
	import { ArrowLeft, ArrowRight, Filter, Plus } from 'svelte-hero-icons';
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardTable from '$lib/components/Dashboard/DashboardTable.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardToolbarFilter from '$lib/components/Dashboard/licencias/DashboardToolbarFilter.svelte';
	import FormDrawerLicencia from '$lib/components/FormDrawer/licencias/FormDrawerLicencia.svelte';
	import tipoLicenciaStore from '$lib/stores/licencias/tipoLicenciaStore';
	import filterLicenciaStore from '$lib/stores/licencias/filterLicenciaStore';
	import type { PageData } from './$types';
	import pageLicenciaStore, { cantLicenciaPage } from '$lib/stores/licencias/pageLicenciaStore';

	export let data: PageData;

	let lastPage = data.lastPage;

	let showDrawer = false;
	let tableData: any;
	let intervalsIds: any = [];
	let stopLongPolling: any;
	let showDropdowns = [false];
	let licenceOrder = { field: 'fechaInicio', direction: true };

	const initLongPolling = (
		page: number,
		order: { field: string; direction: boolean },
		filter: { field: string; filter: string; value: string }[],
		cantLicenciaPage: number,
		tipoLicencia: string = 'ausente'
	) => {
		console.log(cantLicenciaPage);
		intervalsIds.push(
			setInterval(async () => {
				tableData = transformData(
					(await data.reloadData(page, order, filter, cantLicenciaPage, tipoLicencia)).data
				);
			}, 10000)
		);
		console.log('tableData: ', tableData);
		return () => intervalsIds.forEach((id) => clearInterval(id));
	};

	const transformData = (data: any[]) => {
		if (!data) return { headers: [], fields: [], data: [] };
		if (data.length == 0) return { headers: [], fields: [], data: [] };
		return {
			headers: Object.entries(data[0]).map((entries) => entries[0]),
			fields: Object.entries(data[0]).map((entries) => entries[0]),
			data: data
		};
	};

	tableData = transformData(data.licencias);
	stopLongPolling = initLongPolling(
		$pageLicenciaStore,
		licenceOrder,
		[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
		$cantLicenciaPage,
		$tipoLicenciaStore
	);

	pageLicenciaStore.subscribe(async (val) => {
		console.log('pageLicenciaStore');
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					val,
					licenceOrder,
					[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
					$cantLicenciaPage,
					$tipoLicenciaStore
				)
			).data
		);
		console.log(tableData);
		stopLongPolling = initLongPolling(
			val,
			licenceOrder,
			[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$cantLicenciaPage,
			$tipoLicenciaStore
		);
	});

	// cada vez que actualizamos el tipo de licencia recargamos las licencias
	tipoLicenciaStore.subscribe(async (val) => {
		console.log('tipoLicenciaStore');
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					$pageLicenciaStore,
					licenceOrder,
					[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: val }],
					$cantLicenciaPage,
					val
				)
			).data
		);
		stopLongPolling = initLongPolling(
			$pageLicenciaStore,
			licenceOrder,
			[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: val }],
			$cantLicenciaPage,
			val
		);
	});

	filterLicenciaStore.subscribe(async (val) => {
		console.log('filterLicenciaStore');
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					$pageLicenciaStore,
					licenceOrder,
					[...val, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
					$cantLicenciaPage,
					val
				)
			).data
		);
		stopLongPolling = initLongPolling(
			$pageLicenciaStore,
			licenceOrder,
			[...val, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$cantLicenciaPage,
			$tipoLicenciaStore
		);
	});

	const changeCantLicenciaPage = async (e: Event) => {
		cantLicenciaPage.update((n) => e.target.value * 1);
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					$pageLicenciaStore,
					licenceOrder,
					[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
					e.target.value * 1,
					$tipoLicenciaStore
				)
			).data
		);
		stopLongPolling = initLongPolling(
			$pageLicenciaStore,
			licenceOrder,
			[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$cantLicenciaPage
		);
		console.log($filterLicenciaStore);
		const { count } = await data.calcLastPage(
			licenceOrder,
			[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$tipoLicenciaStore
		);
		lastPage = Math.trunc((count / e.target.value) * 1);
	};
</script>

<Header />
<Dashboard bind:showDrawer drawerContent={FormDrawerLicencia} drawerContentProps={data.agentes}>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarButton
			name="Agregar filtro"
			icon={Filter}
			dropdown={true}
			bind:showDropdown={showDropdowns[0]}
			on:click={() => {
				showDropdowns = showDropdowns.map((val, i) => (i == 0 ? val : false));
				showDropdowns[0] = !showDropdowns[0];
				console.log(showDropdowns);
			}}
			textHighlight={$filterLicenciaStore.length !== 0}
		>
			<DashboardToolbarFilter slot="dropdown-content" fields={data.fields} />
		</DashboardToolbarButton>

		<DashboardToolbarSelect
			options={[
				{ name: 'Ausente con aviso', value: 'ausente' },
				{ name: 'Academica', value: 'academica' },
				{ name: 'Vacaciones', value: 'vacaciones' },
				{ name: 'Teletrabajo', value: 'teletrabajo' },
				{ name: 'Salud', value: 'salud' },
				{ name: 'Otro', value: 'otro' }
			]}
			on:input={(e) => {
				tipoLicenciaStore.update((n) => e.target.value);
			}}
		/>
		<div class="flex gap-1 justify-center items-center">
			<DashboardToolbarButton
				name=""
				icon={ArrowLeft}
				on:click={() => {
					pageLicenciaStore.update((n) => (n == 0 ? n : n - 1));
				}}
			/>
			<p class="dark:text-stone-400">{$pageLicenciaStore} / {lastPage}</p>
			<DashboardToolbarButton
				name=""
				icon={ArrowRight}
				on:click={() => {
					pageLicenciaStore.update((n) => (n == lastPage ? n : n + 1));
				}}
			/>
		</div>
		<DashboardToolbarSelect
			options={[
				{ name: '10', value: 10 },
				{ name: '50', value: 50 },
				{ name: '100', value: 100 }
			]}
			on:input={changeCantLicenciaPage}
		/>
		<DashboardToolbarButton
			name="Agregar licencia"
			highlight={true}
			icon={Plus}
			on:click={() => {
				showDrawer = true;
			}}
		/>
	</div>
	<DashboardTable {tableData} slot="dashboard-content" />
</Dashboard>
