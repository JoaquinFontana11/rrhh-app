<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardCalendar from '$lib/components/Calendar/DashboardCalendar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let month: number = new Date().getMonth();
	let year: number = new Date().getFullYear();
	let tipoLicencia: string = 'todas';
	let direccion: number = 100;
	let equipo: number = 100;
	let equipos = [...data.equipos, { equipo: 'Todos los equipos', id: 100 }];

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

	const reloadItems = (month: number, tipoLicencia: string, direccion: number, equipo: number) => {
		console.log(direccion);
		console.log([...data.equipos]);
		if (direccion !== 100) {
			equipos = [...data.equipos].filter((equipo) => {
				return equipo.direccion
					? equipo.direccion === direccion
					: equipo.id === 100 || equipo.id === 0;
			});
			equipos.push({ equipo: 'Todos los equipos', id: 100 });
		} else equipos = [...data.equipos, { equipo: 'Todos los equipos', id: 100 }];
		console.log(equipos);
		let licencias = data.data
			.filter((licencia) => {
				const licenciaMonthInicio = new Date(licencia.fechaInicio).getMonth();
				const licenciaMonthFin = new Date(licencia.fechaFin).getMonth();
				return (
					licenciaMonthInicio == month ||
					(licenciaMonthFin == month && licenciaMonthInicio == month - 1)
				);
			})
			.filter((licencia) => direccion == 100 || licencia.agente.direccion.id == direccion)
			.filter((licencia) => equipo == 100 || licencia.agente.equipo.id == equipo);

		let licenciasCompletas: { day: number; tipo: string }[] = [];

		licencias.forEach((licencia) => {
			// si la fecha de fin es en otro mes se recorre hasta fin de mes
			// si la fecha de inicio es en el mes anterior se arranca desde el principio
			const licenciaTerminaPosterior = new Date(licencia.fechaFin).getMonth() > month;
			const licenciaIniciaAnterior = new Date(licencia.fechaInicio).getMonth() < month;

			const fechaInicio = licenciaIniciaAnterior ? 1 : new Date(licencia.fechaInicio).getDate() + 1;
			const fechaFin = licenciaTerminaPosterior
				? new Date(year, month, 0).getDate()
				: new Date(licencia.fechaFin).getDate() + 1;

			for (let i = fechaInicio; i <= fechaFin; i++) {
				licenciasCompletas.push({ day: i, tipo: licencia.tipo });
			}
		});

		licenciasCompletas = licenciasCompletas.sort((licencia1, licencia2) => {
			if (licencia1.day > licencia2.day) return 1;
			return -1;
		});

		let actualDay = -1;

		licenciasCompletas.forEach((licencia) => {
			if (actualDay < licencia.day) {
				actualDay = licencia.day;
				calendarItems[licencia.day] = [];
			}
			calendarItems[actualDay].push(licencia.tipo);
		});

		Object.entries(calendarItems).forEach(([day, tipos]: any) => {
			calendarItems[day] = [];
			const tiposPermitidos =
				tipoLicencia == 'todas'
					? ['salud', 'otro', 'ausente', 'teletrabajo', 'vacaciones', 'academica']
					: [tipoLicencia];
			tiposPermitidos.forEach((tipo) => {
				let countTipo = tipos.filter((t: string) => t == tipo).length;
				if (countTipo == 0) return;
				calendarItems[day].push({ color: colors[tipo], content: `${countTipo} - ${tipo}` });
			});
		});
	};

	$: reloadItems(month, tipoLicencia, direccion, equipo);
</script>

<Header />
<Dashboard>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarSelect
			conf="w-72"
			options={equipos.map((equipo) => {
				return { value: equipo.id, name: equipo.equipo };
			})}
			bind:value={equipo}
		/><DashboardToolbarSelect
			options={[
				...data.direcciones.map((direccion) => {
					return { value: direccion.id, name: direccion.acronimo };
				}),
				{ name: 'Todas las direcciones', value: 100 }
			]}
			bind:value={direccion}
		/>
		<DashboardToolbarSelect
			options={[
				{ name: 'Todas las licencias', value: 'todas' },
				{ name: 'Ausente con aviso', value: 'ausente' },
				{ name: 'Academica', value: 'academica' },
				{ name: 'Vacaciones', value: 'vacaciones' },
				{ name: 'Teletrabajo', value: 'teletrabajo' },
				{ name: 'Salud', value: 'salud' },
				{ name: 'Otro', value: 'otro' }
			]}
			bind:value={tipoLicencia}
		/>
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
			bind:value={month}
			on:input={updateMonth}
		/>
	</div>

	<DashboardCalendar
		slot="dashboard-content"
		bind:month
		{year}
		bind:tipoLicencia
		bind:direccion
		bind:equipo
		items={calendarItems}
	/>
</Dashboard>
