<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardCalendar from '$lib/components/Calendar/DashboardCalendar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let month: number = new Date().getMonth();
	let year: number = new Date().getFullYear();
	let licencias = data.data;

	const updateMonth = (e: Event) => {
		const target = e.target as HTMLSelectElement;

		month = parseInt(target.value);
	};
</script>

<Header />
<Dashboard>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarSelect
			options={[
				{ name: 'enero', value: 0 },
				{ name: 'febrero', value: 1 },
				{ name: 'marzo', value: 2 },
				{ name: 'abril', value: 3 },
				{ name: 'mayo', value: 4 },
				{ name: 'junio', value: 5 },
				{ name: 'julio', value: 6 },
				{ name: 'agosto', value: 7 },
				{ name: 'septiembre', value: 8 },
				{ name: 'octubre', value: 9 },
				{ name: 'noviembre', value: 10 },
				{ name: 'diciembre', value: 11 }
			]}
			on:input={updateMonth}
		/>
	</div>

	<DashboardCalendar slot="dashboard-content" bind:month {year} />
</Dashboard>
