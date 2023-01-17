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

	export let data: PageData;

	let showDrawer = false;
	let tableData: any;
	let intervalsIds: any = [];
	let stopLongPolling: any;
	let showDropdowns = [false];

	const initLongPolling = (
		page: number,
		order: { field: string; direction: boolean },
		filter: { field: string; filter: string; value: string }[],
		cantPage: number,
		tipoLicencia: string = 'ausente'
	) => {
		intervalsIds.push(
			setInterval(async () => {
				tableData = transformData(
					(await data.reloadData(page, order, filter, cantPage, tipoLicencia)).data
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
		0,
		{ field: 'fechaInicio', direction: true },
		[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
		10,
		$tipoLicenciaStore
	);

	// cada vez que actualizamos el tipo de licencia recargamos las licencias
	tipoLicenciaStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					0,
					{ field: 'fechaInicio', direction: true },
					[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: val }],
					10,
					val
				)
			).data
		);
		stopLongPolling = initLongPolling(
			0,
			{ field: 'fechaInicio', direction: true },
			[...$filterLicenciaStore, { field: 'tipo', filter: 'eq', value: val }],
			10,
			$tipoLicenciaStore
		);
	});
	filterLicenciaStore.subscribe(async (val) => {
		stopLongPolling();
		tableData = transformData(
			(
				await data.reloadData(
					0,
					{ field: 'fechaInicio', direction: true },
					[...val, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
					10,
					val
				)
			).data
		);
		stopLongPolling = initLongPolling(
			0,
			{ field: 'fechaInicio', direction: true },
			[...val, { field: 'tipo', filter: 'eq', value: $tipoLicenciaStore }],
			10,
			$tipoLicenciaStore
		);
	});
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
				{ name: 'Vacaciones', value: 'vacaciones' },
				{ name: 'Teletrabajo', value: 'teletrabajo' },
				{ name: 'Salud', value: 'salud' },
				{ name: 'Otro', value: 'otro' }
			]}
			on:input={(e) => {
				tipoLicenciaStore.update((n) => e.target.value);
			}}
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
