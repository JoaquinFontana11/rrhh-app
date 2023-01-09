<script lang="ts">
	import { ArrowLeft, ArrowRight, Filter, Plus } from 'svelte-hero-icons';
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardTable from '$lib/components/Dashboard/DashboardTable.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import FormDrawerLicencia from '$lib/components/FormDrawer/licencias/FormDrawerLicencia.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let showDrawer = false;

	let tableData = {
		headers: ['1'],
		fields: ['1'],
		data: [
			{
				'1': 'juan'
			}
		]
	};
</script>

<Header />
<Dashboard bind:showDrawer drawerContent={FormDrawerLicencia}>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarButton name="Agregar filtros" icon={Filter} />

		<div class="flex gap-1 justify-center items-center">
			<DashboardToolbarButton name="" icon={ArrowLeft} />
			<p class="dark:text-stone-400">0 / 0</p>
			<DashboardToolbarButton name="" icon={ArrowRight} />
		</div>

		<DashboardToolbarSelect
			options={[
				{ name: 'Ausente con aviso', value: '' },
				{ name: 'Vacaciones', value: '' },
				{ name: 'Teletrabajo', value: '' },
				{ name: 'Salud', value: '' },
				{ name: 'Presentismo', value: '' },
				{ name: 'Total', value: '' },
				{ name: 'Academica', value: '' }
			]}
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
