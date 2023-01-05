<script lang="ts">
	import FormDrawer from './FormDrawer.svelte';
	import FormDrawerInputGroup from './FormDrawerInputGroup.svelte';
	import FormDrawerInputGroupButton from './FormDrawerInputGroupButton.svelte';
	import { validateEmptyInput, validateInputEmail } from './validators';
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
	const labels = {
		datosPersonales: 'Datos Personales',
		datosSalud: 'Datos de Salud',
		datosAcademicos: 'Datos Academicos',
		recorrido: 'Recorrido'
	};
	const components: IComponentObject = {
		datosPersonales: [
			{
				type: 'number',
				label: 'DNI',
				name: 'DNI',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'number',
				label: 'CUIT',
				name: 'CUIT',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'date',
				label: 'Fecha de nacimiento',
				name: 'fechaNacimiento',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'domicilio',
				name: 'domicilio',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'email',
				label: 'email personal',
				name: 'emailPersonal',
				value: '',
				required: true,
				validators: [validateEmptyInput, validateInputEmail]
			},
			{
				type: 'email',
				label: 'email institucional',
				name: 'emailInstitucional',
				value: '',
				required: true,
				validators: [
					validateEmptyInput,
					validateInputEmail,
					(value: any) => {
						if (!value.endsWith('@gba.gob.ar'))
							return {
								message: 'No se cumple el formato de email Institucional',
								status: false
							};
					}
				]
			},
			{
				type: 'number',
				label: 'telefono',
				name: 'telefono',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'categoria',
				name: 'categoria',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'curriculum',
				name: 'curriculum',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'agrupamiento',
				name: 'agrupamiento',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'genero',
				name: 'genero',
				value: '',
				required: true,
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Superior Directo',
				name: 'superiorDirecto',
				value: '',
				required: true,
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'medicamentos',
				name: 'medicamentos',
				value: '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'consideraciones',
				name: 'consideracion',
				value: '',
				required: false,
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
			}
		],
		datosAcademicos: [
			{
				type: 'text',
				label: 'Carrera Universitaria',
				name: 'carreraUniversitaria',
				value: '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Carrera Postgrado',
				name: 'carreraPostgrado',
				value: '',
				required: false,
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
			}
		],
		recorrido: [
			{
				type: 'number',
				label: 'Antiguedad CLS',
				name: 'antiguedadCLS',
				value: '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'number',
				label: 'Antiguedad PPT',
				name: 'antiguedadPPT',
				value: '',
				required: false,
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'date',
				label: 'Ingreso a Planta temporaria',
				name: 'ingresoPlantaTemporaria',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Exp. tramitacion designacion',
				name: 'expTramitacionDesignacion',
				value: '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Reso. designacion',
				name: 'resoDesignacion',
				value: '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'number',
				label: 'Numero SIAPE',
				name: 'numSIAPE',
				value: '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'date',
				label: 'Baja PPT',
				name: 'bajaPTT',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Exp. baja PPT',
				name: 'expBajaPPT',
				value: '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'date',
				label: 'Ingreso CLS',
				name: 'ingresoCLS',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'date',
				label: 'Baja CLS',
				name: 'bajaCLS',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			}
		]
	};
	const validateForm = async (e: CustomEvent) => {
		console.log(e.detail);
		validate[e.detail.form] = e.detail.status;
	};
</script>

<div
	class="p-2 flex flex-col items-center w-full scrollbar-thin scrollbar-w-10 overflow-y-scroll overflow-x-visible"
>
	<FormDrawer {components} action="create">
		{#each formNames as formName}
			<FormDrawerInputGroupButton
				dropdown={() => {
					dropdown[formName] = !dropdown[formName];
				}}
				label={labels[formName]}
				validate={validate[formName]}
			/>
			{#if dropdown[formName]}
				<div class=" w-full  rounded-lg divide-y divide-gray-100  dark:bg-stone-900">
					<FormDrawerInputGroup
						bind:components={components[formName]}
						on:destroy={validateForm}
						{formName}
					/>
				</div>
			{/if}
		{/each}
	</FormDrawer>
</div>
