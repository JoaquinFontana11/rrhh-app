<script lang="ts">
	import { fly } from 'svelte/transition';
	import FormDrawer from './FormDrawer.svelte';
	import FormDrawerInputGroup from './FormDrawerInputGroup.svelte';
	import FormDrawerInputGroupButton from './FormDrawerInputGroupButton.svelte';
	import type { FunctionsObject, IComponent, IComponentObject } from '$lib/types';
	import { agenteStore } from '$lib/stores/agenteStore';

	let action = 'create';

	agenteStore.subscribe((agente) => {
		action = Object.entries(agente).length == 0 ? 'create' : 'update';
	});

	const dropdown = {
		datosPersonales: false,
		datosSalud: false,
		datosAcademicos: false,
		recorrido: false
	};
	const validate = {
		datosPersonales: true,
		datosSalud: true,
		datosAcademicos: true,
		recorrido: true
	};
	const formNames = ['datosPersonales', 'datosSalud', 'datosAcademicos', 'recorrido'];
	const labels = {
		datosPersonales: 'Datos Personales',
		datosSalud: 'Datos de Salud',
		datosAcademicos: 'Datos Academicos',
		recorrido: 'Recorrido'
	};
	let components: IComponentObject;

	//TODO: esto rompe porqueno se actualiza la store cuando se cambia un input

	$: components = {
		datosPersonales: [
			{
				type: 'number',
				label: 'DNI',
				name: 'DNI',
				value: $agenteStore.DNI || '',
				required: true
			},
			{
				type: 'number',
				label: 'CUIT',
				name: 'CUIT',
				value: $agenteStore.CUIT || '',
				required: true
			},
			{
				type: 'date',
				label: 'Fecha de nacimiento',
				name: 'fechaNacimiento',
				value: $agenteStore.fechaNacimiento || '',
				required: true
			},
			{
				type: 'text',
				label: 'domicilio',
				name: 'domicilio',
				value: $agenteStore.domicilio || '',
				required: true
			},
			{
				type: 'email',
				label: 'email personal',
				name: 'emailPersonal',
				value: $agenteStore.emailPersonal || '',
				required: true
			},
			{
				type: 'email',
				label: 'email institucional',
				name: 'emailInstitucional',
				value: $agenteStore.emailInstitucional || '',
				required: true
			},
			{
				type: 'number',
				label: 'telefono',
				name: 'telefono',
				value: $agenteStore.telefono || '',
				required: true
			},
			{
				type: 'text',
				label: 'categoria',
				name: 'categoria',
				value: $agenteStore.categoria || '',
				required: true
			},
			{
				type: 'text',
				label: 'curriculum',
				name: 'curriculum',
				value: $agenteStore.curriculum || '',
				required: true
			},
			{
				type: 'text',
				label: 'agrupamiento',
				name: 'agrupamiento',
				value: $agenteStore.agrupamientoc || '',
				required: true
			},
			{
				type: 'text',
				label: 'genero',
				name: 'genero',
				value: $agenteStore.genero || '',
				required: true
			},
			{
				type: 'select',
				label: 'Activo',
				name: 'activo',
				value: $agenteStore.activo || '',
				required: true,
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			},
			{
				type: 'select',
				label: 'Equipo',
				name: 'equipo',
				value: $agenteStore.equipo || '',
				required: true,
				options: [
					{ value: 1, name: 'equipo1' },
					{ value: 2, name: 'equipo2' }
				]
			},
			{
				type: 'select',
				label: 'Direccion de linea',
				name: 'direccion',
				value: $agenteStore.direccion || '',
				required: true,
				options: [
					{ value: 1, name: 'direccion1' },
					{ value: 2, name: 'direccion2' }
				]
			},
			{
				type: 'select',
				label: 'Rol',
				name: 'rol',
				value: $agenteStore.rol || '',
				required: true,
				options: [
					{ value: 1, name: 'empleado' },
					{ value: 2, name: 'coordinador' },
					{ value: 3, name: 'esclavo' }
				]
			},
			{
				type: 'text',
				label: 'Superior Directo',
				name: 'superiorDirecto',
				value: $agenteStore.superiorDirecto || '',
				required: true
			}
		],
		datosSalud: [
			{
				type: 'select',
				label: 'Tipo de Sangre',
				name: 'tipoSangre',
				value: $agenteStore.datosSalud?.tipoSangre || '',
				required: true,
				options: [
					{ value: 'A+', name: 'A+' },
					{ value: 'A-', name: 'A-' },
					{ value: 'B+', name: 'B+' },
					{ value: 'B-', name: 'B-' },
					{ value: 'AB+', name: 'AB+' },
					{ value: 'AB-', name: 'AB-' },
					{ value: '0+', name: '0+' },
					{ value: '0-', name: '0-' }
				]
			},
			{
				type: 'text',
				label: 'medicamentos',
				name: 'medicamentos',
				value: $agenteStore.datosSalud?.medicamento || '',
				required: false
			},
			{
				type: 'text',
				label: 'consideraciones',
				name: 'consideracion',
				value: $agenteStore.datosSalud?.consideracion || '',
				required: false
			},
			{
				type: 'select',
				label: 'IOMA',
				name: 'IOMA',
				value: $agenteStore.datosSalud?.IOMA || '',
				required: true,
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			}
		],
		datosAcademicos: [
			{
				type: 'text',
				label: 'Carrera Universitaria',
				name: 'carreraUniversitaria',
				value: $agenteStore.datosAcademicos?.carreraUniversitaria || '',
				required: false
			},
			{
				type: 'text',
				label: 'Carrera Postgrado',
				name: 'carreraPostgrado',
				value: $agenteStore.datosAcademicos?.carreraPostgrado || '',
				required: false
			},
			{
				type: 'select',
				label: 'Carrera universitaria Fianlizada',
				name: 'carreraFinalizada',
				value: $agenteStore.datosAcademicos?.carreraFinalizada || '',
				required: true,
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			}
		],
		recorrido: [
			{
				type: 'number',
				label: 'Antiguedad CLS',
				name: 'antiguedadCLS',
				value: $agenteStore.recorrido?.antiguedadCLS || '',
				required: false
			},
			{
				type: 'number',
				label: 'Antiguedad PPT',
				name: 'antiguedadPPT',
				value: $agenteStore.recorrido?.antiguedadPPT || '',
				required: false
			},
			{
				type: 'select',
				label: 'Planta temporaria',
				name: 'plantaTemporaria',
				value: $agenteStore.recorrido?.plantaTemporaria || '',
				required: true,
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			},
			{
				type: 'date',
				label: 'Ingreso a Planta temporaria',
				name: 'ingresoPlantaTemporaria',
				value: $agenteStore.recorrido?.ingresoPlantaTemporaria || '',
				required: false
			},
			{
				type: 'text',
				label: 'Exp. tramitacion designacion',
				name: 'expTramitacionDesignacion',
				value: $agenteStore.recorrido?.expTramitacionDesignacion || '',
				required: false
			},
			{
				type: 'text',
				label: 'Reso. designacion',
				name: 'resoDesignacion',
				value: $agenteStore.recorrido?.resoDesignacion || '',
				required: false
			},
			{
				type: 'number',
				label: 'Numero SIAPE',
				name: 'numSIAPE',
				value: $agenteStore.recorrido?.numSIAPE || '',
				required: false
			},
			{
				type: 'date',
				label: 'Baja PPT',
				name: 'bajaPTT',
				value: $agenteStore.recorrido?.bajaPTT || '',
				required: true
			},
			{
				type: 'text',
				label: 'Exp. baja PPT',
				name: 'expBajaPPT',
				value: $agenteStore.recorrido?.expBajaPPT || '',
				required: false
			},
			{
				type: 'date',
				label: 'Ingreso CLS',
				name: 'ingresoCLS',
				value: $agenteStore.recorrido?.ingresoCLS || '',
				required: true
			},
			{
				type: 'date',
				label: 'Baja CLS',
				name: 'bajaCLS',
				value: $agenteStore.recorrido?.bajaCLS || '',
				required: true
			}
		]
	};

	const validateForm = () => {
		return true;
	};
</script>

<div class="p-2 flex flex-col items-center w-full scrollbar-thin scrollbar-w-10 overflow-y-scroll">
	<FormDrawer {components} {action}>
		{#each formNames as formName}
			<FormDrawerInputGroupButton
				on:click={() => {
					dropdown[formName] = !dropdown[formName];
				}}
				label={labels[formName]}
				validate={true}
			/>
			{#if dropdown[formName]}
				<div class=" w-auto divide-y divide-gray-100  dark:bg-stone-900 mt-3" transition:fly>
					<FormDrawerInputGroup bind:components={components[formName]} on:destroy={validateForm} />
				</div>
			{/if}
		{/each}
	</FormDrawer>
</div>
