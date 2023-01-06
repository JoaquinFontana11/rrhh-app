<script lang="ts">
	import { fly } from 'svelte/transition';
	import FormDrawer from './FormDrawer.svelte';
	import FormDrawerInputGroup from './FormDrawerInputGroup.svelte';
	import FormDrawerInputGroupButton from './FormDrawerInputGroupButton.svelte';
	import { validateEmptyInput, validateInputEmail } from './validators';
	import type { FunctionsObject, IComponent, IComponentObject, IOption } from '$lib/types';
	import { agenteStore } from '$lib/stores/agenteStore';
	import { supabase } from '$lib/supabaseClient';

	let action = 'create';
	let direcciones: IOption[] = [];
	let equipos: IOption[] = [];

	agenteStore.subscribe((agente) => {
		action = Object.entries(agente).length == 0 ? 'create' : 'update';
	});

	const getDirecciones = async () => {
		const { data, error } = await supabase.from('direccion').select('id, nombre');

		direcciones = data.map((direccion) => {
			return {
				value: direccion.id,
				name: direccion.nombre
			};
		});
	};
	const getEquipos = async () => {
		const { data, error } = await supabase.from('equipo').select('id, nombre');

		equipos = data.map((equipo) => {
			return {
				value: equipo.id,
				name: equipo.nombre
			};
		});
	};

	getEquipos();
	getDirecciones();

	const dropdown = {
		datosPersonales: false,
		datosSalud: false,
		datosAcademicos: false,
		recorrido: false
	};
	const validate = {
		datosPersonales: false,
		datosSalud: false,
		datosAcademicos: false,
		recorrido: false
	};
	let disabledbutton: boolean = true;
	const formNames = ['datosPersonales', 'datosSalud', 'datosAcademicos', 'recorrido'];
	const labels = {
		datosPersonales: 'Datos Personales',
		datosSalud: 'Datos de Salud',
		datosAcademicos: 'Datos Academicos',
		recorrido: 'Recorrido'
	};
	let components: IComponentObject;

<<<<<<< HEAD
=======
	let veryComplexValidators: FunctionsObject = {
		datosAcademicos: (components: IComponent) => {
			return components[2] & components[0]
				? { message: '', status: false }
				: { message: 'Si tiene una carrera Finalizada, debe especificar cual', status: true };
		}
	};

	//TODO: esto rompe porqueno se actualiza la store cuando se cambia un input

>>>>>>> origin/feature/validaciones
	$: components = {
		datosPersonales: [
			{
				type: 'number',
				label: 'DNI',
				name: 'DNI',
				value: $agenteStore.DNI || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (value.toString().length !== 8)
							return {
								message: 'El DNI debe tener 8 digitos',
								status: false
							};
					}
				]
			},
			{
				type: 'number',
				label: 'CUIT',
				name: 'CUIT',
				value: $agenteStore.CUIT || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (value.toString().length !== 11)
							return {
								message: 'El CUIT debe tener 11 digitos',
								status: false
							};
					}
				]
			},
			{
				type: 'date',
				label: 'Fecha de nacimiento',
				name: 'fechaNacimiento',
				value: $agenteStore.fechaNacimiento || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (Date.parse(value) >= Date.now())
							return {
								message: 'La fecha de Nacimiento debe ser menor a la fecha actual',
								status: false
							};
					}
				]
			},
			{
				type: 'text',
				label: 'domicilio',
				name: 'domicilio',
				value: $agenteStore.domicilio || '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'email',
				label: 'email personal',
				name: 'emailPersonal',
				value: $agenteStore.emailPersonal || '',
				required: true,
				validators: [validateEmptyInput, validateInputEmail]
			},
			{
				type: 'email',
				label: 'email institucional',
				name: 'emailInstitucional',
				value: $agenteStore.emailInstitucional || '',
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
				value: $agenteStore.telefono || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (value.toString().length < 8 && value.toString().length > 15)
							return {
								message: 'El numero de telefono debe tener entre 9  y 15 digitos',
								status: false
							};
					}
				]
			},
			{
				type: 'text',
				label: 'categoria',
				name: 'categoria',
				value: $agenteStore.categoria || '',
				required: false,
				validators: []
			},
			{
				type: 'text',
				label: 'curriculum',
				name: 'curriculum',
				value: $agenteStore.curriculum || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (!value.startsWith('https://'))
							return {
								message: 'Debe ser una url (https://....)',
								status: false
							};
					}
				]
			},
			{
				type: 'text',
				label: 'agrupamiento',
				name: 'agrupamiento',
				value: $agenteStore.agrupamiento || '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'genero',
				name: 'genero',
				value: $agenteStore.genero || '',
				required: true,
				options: [
					{ value: 'M', name: 'Masculino' },
					{ value: 'F', name: 'Femenino' },
					{ value: 'Otro', name: 'Otro' }
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Activo',
				name: 'activo',
				value: $agenteStore.activo || false,
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
				value: $agenteStore.equipo || 1,
				required: true,
				options: equipos,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Direccion de linea',
				name: 'direccion',
				value: $agenteStore.direccion || 1,
				required: true,
				options: direcciones,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Rol',
				name: 'rol',
				value: $agenteStore.rol || '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Superior Directo',
				name: 'superiorDirecto',
				value: $agenteStore.superiorDirecto || '',
				required: true,
				options: [
					{ value: 1, name: 'señor1' },
					{ value: 2, name: 'señor2' }
				],
				validators: [validateEmptyInput]
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
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'medicamentos',
				name: 'medicamentos',
				value: $agenteStore.datosSalud?.medicamentos || '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'consideraciones',
				name: 'consideracion',
				value: $agenteStore.datosSalud?.consideracion || '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'IOMA',
				name: 'IOMA',
				value: $agenteStore.datosSalud?.IOMA || false,
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
				value: $agenteStore.datosAcademicos?.carreraUniversitaria || '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Carrera Postgrado',
				name: 'carreraPostgrado',
				value: $agenteStore.datosAcademicos?.carreraPostgrado || '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Carrera universitaria Fianlizada',
				name: 'carreraFinalizada',
				value: $agenteStore.datosAcademicos?.carreraFinalizada || false,
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
				value: $agenteStore.recorrido?.antiguedadCLS || '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'number',
				label: 'Antiguedad PPT',
				name: 'antiguedadPPT',
				value: $agenteStore.recorrido?.antiguedadPPT || '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Planta temporaria',
				name: 'plantaTemporaria',
				value: $agenteStore.recorrido?.plantaTemporaria || false,
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
				value: $agenteStore.recorrido?.ingresoPlantaTemporaria || '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Exp. tramitacion designacion',
				name: 'expTramitacionDesignacion',
				value: $agenteStore.recorrido?.expTramitacionDesignacion || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (value.split('-').length !== 6)
							return {
								message: 'No cumple con el formato de Expediente (Tipo-Año-Nro--Ecosistema-Repa)',
								status: false
							};
					}
				]
			},
			{
				type: 'text',
				label: 'Reso. designacion',
				name: 'resoDesignacion',
				value: $agenteStore.recorrido?.resoDesignacion || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (value.split('-').length !== 5)
							return {
								message: 'No cumple con el formato de Resolucion (Tipo-Año-Nro-Ecosistema-Repa)',
								status: false
							};
					}
				]
			},
			{
				type: 'number',
				label: 'Numero SIAPE',
				name: 'numSIAPE',
				value: $agenteStore.recorrido?.numSIAPE || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (value.toString().length !== 6)
							return {
								message: 'El numero SIAPE debe tener 6 digitos',
								status: false
							};
					}
				]
			},
			{
				type: 'date',
				label: 'Baja PPT',
				name: 'bajaPTT',
				value: $agenteStore.recorrido?.bajaPTT || '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'Exp. baja PPT',
				name: 'expBajaPPT',
				value: $agenteStore.recorrido?.expBajaPPT || '',
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (value.split('-').length !== 6)
							return {
								message: 'No cumple con el formato de Expediente (Tipo-Año-Nro--Ecosistema-Repa)',
								status: false
							};
					}
				]
			},
			{
				type: 'date',
				label: 'Ingreso CLS',
				name: 'ingresoCLS',
				value: $agenteStore.recorrido?.ingresoCLS || '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'date',
				label: 'Baja CLS',
				name: 'bajaCLS',
				value: $agenteStore.recorrido?.bajaCLS || '',
				required: true,
				validators: [validateEmptyInput]
			}
		]
	};

	const validateForm = (e: CustomEvent) => {
		console.log(e.detail);
		validate[e.detail.form] = e.detail.status;
		disabledbutton = true
			? !(
					validate.datosPersonales &&
					validate.datosSalud &&
					validate.datosAcademicos &&
					validate.recorrido
			  )
			: false;
	};

	const changeInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		let value: string | number | boolean = target.value;

		if (target.value == 'true' || target.value == 'false') value = target.value == 'true';

		value = target.value * 1 ? target.value * 1 : value;

		agenteStore.update((agente) => {
			console.log(agente);
			if (components.datosPersonales.some((c) => c.name == target.name))
				agente[target.name as string] = value;
			if (components.datosSalud.some((c) => c.name == target.name))
				agente.datosSalud[target.name as string] = value;
			if (components.datosAcademicos.some((c) => c.name == target.name))
				agente.datosAcademicos[target.name as string] = value;
			if (components.recorrido.some((c) => c.name == target.name))
				agente.recorrido[target.name as string] = value;
			return agente;
		});
	};
</script>

<div class="p-2 flex flex-col items-center w-full scrollbar-thin scrollbar-w-10 overflow-y-scroll">
	<FormDrawer
		{components}
		{action}
		disabled={disabledbutton}
		extraValidations={veryComplexValidators}
	>
		{#each formNames as formName}
			<FormDrawerInputGroupButton
				on:click={() => {
					dropdown[formName] = !dropdown[formName];
				}}
				label={labels[formName]}
				validate={validate[formName]}
			/>
			{#if dropdown[formName]}
				<div class=" w-auto divide-y divide-gray-100  dark:bg-stone-900 mt-3" transition:fly>
					<FormDrawerInputGroup
						bind:components={components[formName]}
						on:destroy={validateForm}
						on:input={changeInput}
						{formName}
					/>
				</div>
			{/if}
		{/each}
	</FormDrawer>
</div>
