<script lang="ts">
	import { ArrowLeft, ArrowRight, Filter, Plus, Icon, Document } from 'svelte-hero-icons';
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardTable from '$lib/components/Dashboard/DashboardTable.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardToolbarFilter from '$lib/components/Dashboard/licencias/DashboardToolbarFilter.svelte';
	import FormDrawerLicencia from '$lib/components/FormDrawer/licencias/FormDrawerLicencia.svelte';
	import DashboardToolbarExport from '$lib/components/Dashboard/licencias/DashboardToolbarExport.svelte';
	/*

	import tipoLicenciaStore from '$lib/stores/licencias_old/tipoLicenciaStore';
	import filterLicenciaStore from '$lib/stores/licencias_old/filterLicenciaStore';
	*/
	import { tipoLicenciaStore, filterStore, LicenciaStore } from '$lib/stores/licenciaStore';

	import type { PageData } from './$types';
	import pageLicenciaStore, { cantLicenciaPage } from '$lib/stores/licencias_old/pageLicenciaStore';
	import { supabase } from '$lib/supabaseClient';

	type TableData = {
		headers: string[];
		fields: string[];
		data: any[];
	};

	export let data: PageData;

	let lastPage = data.lastPage;

	let showDrawer = false;
	let tableData: TableData = { headers: [], fields: [], data: [] };
	let intervalsIds: any[] = [];
	let stopLongPolling: Function;
	let showDropdowns = [false];
	let licenceOrder = { field: 'fechaInicio', direction: true };

	const initLongPolling = (
		page: number,
		order: { field: string; direction: boolean },
		filter: { field: string; filter: string; value: string | number | number[] }[],
		cantLicenciaPage: number,
		tipoLicencia: string = 'ausente'
	) => {
		intervalsIds.push(
			setInterval(async () => {
				tableData = transformData(
					(await data.reloadData(page, order, filter, cantLicenciaPage, tipoLicencia)).data
				);
			}, 10000)
		);
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
		[...$filterStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
		$cantLicenciaPage,
		$tipoLicenciaStore
	);

	pageLicenciaStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					val,
					licenceOrder,
					[...$filterStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
					$cantLicenciaPage,
					$tipoLicenciaStore
				)
			).data
		);
		stopLongPolling = initLongPolling(
			val,
			licenceOrder,
			[...$filterStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$cantLicenciaPage,
			$tipoLicenciaStore
		);
	});

	// cada vez que actualizamos el tipo de licencia recargamos las licencias
	tipoLicenciaStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					$pageLicenciaStore,
					licenceOrder,
					[...$filterStore, { field: 'tipo', filter: 'eq', value: val }],
					$cantLicenciaPage,
					val
				)
			).data
		);

		stopLongPolling = initLongPolling(
			$pageLicenciaStore,
			licenceOrder,
			[...$filterStore, { field: 'tipo', filter: 'eq', value: val }],
			$cantLicenciaPage,
			val
		);
		const { count } = await data.calcLastPage(
			licenceOrder,
			[...$filterStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$tipoLicenciaStore
		);
		lastPage = Math.trunc(count / $cantLicenciaPage);
	});

	filterStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					$pageLicenciaStore,
					licenceOrder,
					[...val, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
					$cantLicenciaPage,
					$tipoLicenciaStore
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
		const { count } = await data.calcLastPage(
			licenceOrder,
			[...$filterStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$tipoLicenciaStore
		);
		lastPage = Math.trunc(count / $cantLicenciaPage);
	});

	const changeCantLicenciaPage = async (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const value = target.value;
		cantLicenciaPage.update((n) => parseInt(value));
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					$pageLicenciaStore,
					licenceOrder,
					[...$filterStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
					parseInt(value),
					$tipoLicenciaStore
				)
			).data
		);
		stopLongPolling = initLongPolling(
			$pageLicenciaStore,
			licenceOrder,
			[...$filterStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$cantLicenciaPage,
			$tipoLicenciaStore
		);
		const { count } = await data.calcLastPage(
			licenceOrder,
			[...$filterStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			$tipoLicenciaStore
		);
		lastPage = Math.trunc(count / parseInt(value));
	};

	const updateTipoLicencia = (e: Event) => {
		const target = e.target as HTMLSelectElement;

		tipoLicenciaStore.update((n) => target.value);
	};
</script>

<Header />
<Dashboard bind:showDrawer drawerContent={FormDrawerLicencia} drawerContentProps={data.agentes}>
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
			<DashboardToolbarExport slot="dropdown-content" manageFilters={data.manageFilters} />
		</DashboardToolbarButton>
		<DashboardToolbarButton
			name="Agregar filtro"
			icon={Filter}
			dropdown={true}
			bind:showDropdown={showDropdowns[0]}
			on:click={() => {
				showDropdowns = showDropdowns.map((val, i) => (i == 0 ? val : false));
				showDropdowns[0] = !showDropdowns[0];
			}}
			textHighlight={$filterStore.length !== 0}
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
			value="ausente"
			on:input={updateTipoLicencia}
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
			value={10}
			on:input={changeCantLicenciaPage}
		/>
		<DashboardToolbarButton
			name="Agregar licencia"
			highlight={true}
			icon={Plus}
			on:click={() => {
				LicenciaStore.update((n) => {
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
				on:click={async () => {
					const data = await supabase
						.from('agente')
						.select('id')
						.eq('nombreCompleto', rowData.nombreCompleto)
						.limit(1)
						.single();
					rowData.agente = data.data?.id;
					LicenciaStore.update((n) => rowData);

					showDrawer = true;
				}}
				class="w-6 h-6 bg-DPMA-Turquoise flex justify-center items-center rounded-full m-2 dark:text-stone-900 hover:bg-light-Turquoise"
				><Icon src={Document} class="w-4 h-4" /></button
			></td
		>
	</DashboardTable>
</Dashboard>
