<script lang="ts">
	import FormInputGroup from '../FormInputGroup.svelte';
	import FormAgente from '../FormAgente.svelte';
	import DrawerDropDownButton from './DrawerDropDownButton.svelte';
	import { validateEmptyInput } from '../Inputs/validators';
	import type { FunctionsObject, IComponent, IComponentObject } from '$lib/types';

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
	const components: IComponentObject = {
		datosPersonales: [
			{
				type: 'number',
				label: 'DNI',
				name: 'DNI',
				value: '',
				required: true
			},
			{
				type: 'number',
				label: 'CUIT',
				name: 'CUIT',
				value: '',
				required: true
			},
			{
				type: 'date',
				label: 'Fecha de nacimiento',
				name: 'fechaNacimiento',
				value: '',
				required: true
			},
			{
				type: 'text',
				label: 'domicilio',
				name: 'domicilio',
				value: '',
				required: true
			},
			{
				type: 'email',
				label: 'email personal',
				name: 'emailPersonal',
				value: '',
				required: true
			},
			{
				type: 'email',
				label: 'email institucional',
				name: 'emailInstitucional',
				value: '',
				required: true
			},
			{
				type: 'number',
				label: 'telefono',
				name: 'telefono',
				value: '',
				required: true
			},
			{
				type: 'text',
				label: 'categoria',
				name: 'categoria',
				value: '',
				required: true
			},
			{
				type: 'text',
				label: 'curriculum',
				name: 'curriculum',
				value: '',
				required: true
			},
			{
				type: 'text',
				label: 'agrupamiento',
				name: 'agrupamiento',
				value: '',
				required: true
			},
			{
				type: 'text',
				label: 'genero',
				name: 'genero',
				value: '',
				required: true
			},
			{
				type: 'select',
				label: 'Activo',
				name: 'activo',
				value: '',
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
				value: '',
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
				value: '',
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
				value: '',
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
				value: '',
				required: true
			}
		],
		datosSalud: [
			{
				type: 'select',
				label: 'Tipo de Sangre',
				name: 'tipoSangre',
				value: '',
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
				value: '',
				required: false
			},
			{
				type: 'text',
				label: 'consideraciones',
				name: 'consideracion',
				value: '',
				required: false
			},
			{
				type: 'select',
				label: 'IOMA',
				name: 'IOMA',
				value: '',
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
				value: '',
				required: false
			},
			{
				type: 'text',
				label: 'Carrera Postgrado',
				name: 'carreraPostgrado',
				value: '',
				required: false
			},
			{
				type: 'select',
				label: 'Carrera universitaria Fianlizada',
				name: 'carreraFinalizada',
				value: '',
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
				value: '',
				required: false
			},
			{
				type: 'number',
				label: 'Antiguedad PPT',
				name: 'antiguedadPPT',
				value: '',
				required: false
			},
			{
				type: 'select',
				label: 'Planta temporaria',
				name: 'plantaTemporaria',
				value: '',
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
				value: '',
				required: true
			},
			{
				type: 'text',
				label: 'Exp. tramitacion designacion',
				name: 'expTramitacionDesignacion',
				value: '',
				required: false
			},
			{
				type: 'text',
				label: 'Reso. designacion',
				name: 'resoDesignacion',
				value: '',
				required: false
			},
			{
				type: 'number',
				label: 'Numero SIAPE',
				name: 'numSIAPE',
				value: '',
				required: false
			},
			{
				type: 'date',
				label: 'Baja PPT',
				name: 'bajaPPT',
				value: '',
				required: true
			},
			{
				type: 'text',
				label: 'Exp. baja PPT',
				name: 'expBajaPPT',
				value: '',
				required: false
			},
			{
				type: 'date',
				label: 'Ingreso CLS',
				name: 'ingresoCLS',
				value: '',
				required: true
			},
			{
				type: 'date',
				label: 'Baja CLS',
				name: 'bajaCLS',
				value: '',
				required: true
			}
		]
	};

	const validators: FunctionsObject = {
		datosPersonales: (data: any) => {
			console.log(data);
			if (
				validateEmptyInput(data[0][1]).status &&
				validateEmptyInput(data[1][1]).status &&
				validateEmptyInput(data[2][1]).status &&
				validateEmptyInput(data[3][1]).status &&
				validateEmptyInput(data[4][1]).status &&
				validateEmptyInput(data[5][1]).status &&
				validateEmptyInput(data[6][1]).status &&
				validateEmptyInput(data[7][1]).status &&
				validateEmptyInput(data[8][1]).status &&
				validateEmptyInput(data[9][1]).status &&
				validateEmptyInput(data[10][1]).status &&
				validateEmptyInput(data[10][1]).status &&
				validateEmptyInput(data[11][1]).status &&
				validateEmptyInput(data[12][1]).status &&
				validateEmptyInput(data[13][1]).status &&
				validateEmptyInput(data[14][1]).status
			) {
				return { form: 'datosPersonales', status: true, message: 'Se subio correctamente' };
			} else {
				return {
					form: 'datosPersonales',
					status: false,
					message: 'Alguno de los datos ingresados es incorrecto'
				};
			}
		},
		datosSalud: (data: any) => {
			console.log(data);
			if (validateEmptyInput(data[0][1]).status && validateEmptyInput(data[3][1]).status) {
				return { form: 'datosSalud', status: true, message: 'Se subio correctamente' };
			} else {
				return {
					form: 'datosSalud',
					status: false,
					message: 'Alguno de los datos ingresados es incorrecto'
				};
			}
		},
		datosAcademicos: (data: any) => {
			console.log(data);
			if (
				validateEmptyInput(data[0][1]).status &&
				validateEmptyInput(data[1][1]).status &&
				validateEmptyInput(data[2][1]).status
			) {
				return { form: 'datosAcademicos', status: true, message: 'Se subio correctamente' };
			} else {
				return {
					form: 'datosAcademicos',
					status: false,
					message: 'Alguno de los datos ingresados es incorrecto'
				};
			}
		},
		recorrido: (data: any) => {
			console.log(data);
			if (
				validateEmptyInput(data[0][1]).status &&
				validateEmptyInput(data[1][1]).status &&
				validateEmptyInput(data[2][1]).status &&
				validateEmptyInput(data[3][1]).status &&
				validateEmptyInput(data[4][1]).status &&
				validateEmptyInput(data[5][1]).status &&
				validateEmptyInput(data[6][1]).status &&
				validateEmptyInput(data[7][1]).status &&
				validateEmptyInput(data[8][1]).status &&
				validateEmptyInput(data[9][1]).status &&
				validateEmptyInput(data[10][1]).status
			) {
				return { form: 'recorrido', status: true, message: 'Se subio correctamente' };
			} else {
				return {
					form: 'recorrido',
					status: false,
					message: 'Alguno de los datos ingresados es incorrecto'
				};
			}
		}
	};

	const validateForm = async (e: CustomEvent) => {
		console.log(e.detail);
		validate[e.detail.form + ''] = e.detail.status;
		console.log(validate);
	};
	console.log(validate);
</script>

<div
	class="p-2 flex flex-col items-center w-[85.5%]  scrollbar-thin scrollbar-w-10 overflow-y-scroll"
>
	<FormAgente>
		{#each formNames as formName}
			<DrawerDropDownButton
				validate={validate[formName]}
				dropdown={() => {
					dropdown[formName] = !dropdown[formName];
				}}
				label={formName}
			/>
			{#if dropdown[formName]}
				<div class=" w-full  rounded-lg divide-y divide-gray-100 shadow dark:bg-stone-900">
					<FormInputGroup
						bind:components={components[formName]}
						validators={validators[formName]}
						on:destroy={validateForm}
					/>
				</div>
			{/if}
		{/each}
	</FormAgente>
</div>
