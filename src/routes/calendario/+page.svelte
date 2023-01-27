<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardCalendar from '$lib/components/Calendar/DashboardCalendar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let month: number = new Date().getMonth();
	let year: number = new Date().getFullYear();

	const updateMonth = (e: Event) => {
		const target = e.target as HTMLSelectElement;

		month = parseInt(target.value);
	};

	let calendarItems: any = {};
	const colors: { [key: string]: string } = {
		ausente: 'yellow',
		salud: 'green',
		vacaciones: 'orange',
		otro: 'red',
		academica: 'indigo',
		teletrabajo: 'sky'
	};

	const reloadItems = (month: number) => {
		let licencias = data.data
			.filter((licencia) => {
				return new Date(licencia.fechaInicio).getMonth() == month;
			})
			.map((licencia) => {
				return {
					day: new Date(licencia.fechaInicio).getDate(),
					tipo: licencia.tipo
				};
			})
			.sort((licencia1, licencia2) => {
				if (licencia1.day > licencia2.day) return 1;
				return -1;
			});
		let actualDay = -1;

		licencias.forEach((licencia) => {
			if (actualDay < licencia.day) {
				actualDay = licencia.day;
				calendarItems[licencia.day] = [];
			}
			calendarItems[actualDay].push(licencia.tipo);
		});

		Object.entries(calendarItems).forEach(([day, tipos]: any) => {
			calendarItems[day] = [];
			['salud', 'otro', 'ausente', 'teletrabajo', 'vacaciones', 'academica'].forEach((tipo) => {
				let countTipo = tipos.filter((t: string) => t == tipo).length;
				if (countTipo == 0) return;
				calendarItems[day].push({ color: colors[tipo], content: `${countTipo} - ${tipo}` });
			});
		});
	};

	$: reloadItems(month);
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

	<DashboardCalendar slot="dashboard-content" bind:month {year} items={calendarItems} />
</Dashboard>
