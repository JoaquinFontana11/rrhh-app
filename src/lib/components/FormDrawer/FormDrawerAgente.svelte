<script lang="ts">
	import { Icon, ExclamationCircle, CheckCircle } from 'svelte-hero-icons';
	import { fly } from 'svelte/transition';
	import FormDrawer from './FormDrawer.svelte';
	import FormDrawerInputGroup from './FormDrawerInputGroup.svelte';
	import FormDrawerInputGroupButton from './FormDrawerInputGroupButton.svelte';
	import { validateEmptyInput, validateInputEmail } from './validators';
	//import { agenteStore } from '$lib/stores/agenteStore';
	import { agenteStore } from '$lib/stores/nominaStores';
	import { supabase } from '$lib/supabaseClient';

	import type { PostgrestResponse } from '@supabase/supabase-js';
	import type {
		FunctionsObject,
		IComponent,
		IComponentObject,
		IOption,
		AgenteSupabase,
		DireccionSupabase,
		EquipoSupabase,
		ErrorObject
	} from '$lib/types';

	let action = 'create';
	let direcciones: IOption[] = [];
	let equipos: IOption[] = [];
	let superioresDirectos: IOption[] = [];
	let tipoContratacion: { [key: string]: boolean } = {
		CLS: true,
		PTT: true,
		PP: true
	};
	let showErrors: boolean = false;
	let errorsMessage: ErrorObject[] = [];

	let successMessage: { title: string; description: string } = { title: '', description: '' };
	let success: boolean = false;

	$: tipoContratacion = {
		CLS: $agenteStore.tipoContratacion ? !($agenteStore.tipoContratacion === 'CLS') : true,
		PTT: $agenteStore.tipoContratacion ? !($agenteStore.tipoContratacion === 'PTT') : true,
		PP: $agenteStore.tipoContratacion ? !($agenteStore.tipoContratacion === 'PP') : true
	};
	agenteStore.subscribe((agente) => {
		action = Object.keys(agente).includes('id') ? 'update' : 'create';
	});

	const getSuperioresDorectos = async (direccion: string | number) => {
		const res: PostgrestResponse<AgenteSupabase> = await supabase
			.from('agente')
			.select('*, direccion(*)')
			.in('rol', ['Director', 'director', 'Coordinador', 'coordinador']);

		if (!res.data) return;

		let agentes: AgenteSupabase[] = res.data;

		superioresDirectos = agentes
			.filter((agente) => {
				const direccionAgente = agente.direccion as DireccionSupabase;
				return direccionAgente.id == direccion;
			})
			.map((superior) => {
				return {
					value: superior.id,
					name: superior.nombreCompleto
				};
			});
	};

	const getDirecciones = async () => {
		const res: PostgrestResponse<DireccionSupabase> = await supabase
			.from('direccion')
			.select('id, direccion');

		if (!res.data) return;

		direcciones = res.data.map((direccion) => {
			return {
				value: direccion.id,
				name: direccion.direccion
			};
		});
	};
	const getEquipos = async () => {
		const res: PostgrestResponse<EquipoSupabase> = await supabase
			.from('equipo')
			.select('id, equipo');

		if (!res.data) return;

		equipos = res.data.map((equipo) => {
			return {
				value: equipo.id,
				name: equipo.equipo
			};
		});
	};

	getEquipos();
	getDirecciones();
	$: getSuperioresDorectos(
		$agenteStore.direccion?.id ? $agenteStore.direccion.id : $agenteStore.direccion
	);

	const dropdown: { [key: string]: any } = {
		datosPersonales: false,
		datosSalud: false,
		datosAcademicos: false,
		datosRecorrido: false
	};
	const validate: { [key: string]: any } = {
		datosPersonales: true,
		datosSalud: true,
		datosAcademicos: true,
		datosRecorrido: true
	};
	let disabledbutton: boolean = true;
	const formNames = ['datosPersonales', 'datosSalud', 'datosAcademicos', 'datosRecorrido'];
	const labels: { [key: string]: any } = {
		datosPersonales: 'Datos Personales',
		datosSalud: 'Datos de Salud',
		datosAcademicos: 'Datos Academicos',
		datosRecorrido: 'Datos Institucionales'
	};

	let veryComplexValidators: FunctionsObject = {
		datosAcademicos: (components: IComponent) => {
			return components[2].value && components[0].value === ''
				? { message: 'Si tiene una carrera Finalizada, debe especificar cual', status: true }
				: { message: '', status: false };
		}
	};

	let components: IComponentObject;
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
				type: 'text',
				label: 'Nombre Completo',
				name: 'nombreCompleto',
				value: $agenteStore.nombreCompleto || '',
				required: true,
				validators: [validateEmptyInput]
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
				required: false,
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
				value: $agenteStore.activo || true,
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
				value: $agenteStore.equipo?.id || $agenteStore.equipo || '',
				required: true,
				options: equipos,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Direccion de linea',
				name: 'direccion',
				value: $agenteStore.direccion?.id || $agenteStore.direccion || '',
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
				value: $agenteStore.superiorDirecto?.id || $agenteStore.superiorDirecto || '',
				required: true,
				options: superioresDirectos,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Tiene hijos',
				name: 'tieneHijos',
				value: $agenteStore.tieneHijos || false,
				required: true,
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Asignacion familiar',
				name: 'asignacionFamiliar',
				value: $agenteStore.asignacionFamiliar || false,
				required: true,
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'Beneficio de guarderia',
				name: 'beneficioGuarderia',
				value: $agenteStore.beneficioGuarderia || false,
				required: true,
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				],
				validators: [validateEmptyInput]
			}
		],
		datosSalud: [
			{
				type: 'select',
				label: 'Tipo de Sangre',
				name: 'tipoSangre',
				value: $agenteStore.tipoSangre || '',
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
				value: $agenteStore.medicamentos || '',
				required: false,
				validators: []
			},
			{
				type: 'text',
				label: 'consideraciones',
				name: 'consideracion',
				value: $agenteStore.consideracion || '',
				required: false,
				validators: []
			},
			{
				type: 'select',
				label: 'Obra Social',
				name: 'obraSocial',
				value: $agenteStore.obraSocial || '',
				required: true,
				options: [
					{ value: 'IOMA', name: 'IOMA' },
					{ value: 'otro', name: 'otro' }
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'number',
				label: 'telefono de contacto de emergencia',
				name: 'telefonoContactoEmergencia',
				value: $agenteStore.telefonoContactoEmergencia || '',
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
				label: 'nombre de contacto de emergencia',
				name: 'nombreContactoEmergencia',
				value: $agenteStore.nombreContactoEmergencia || '',
				required: true,
				validators: [validateEmptyInput]
			}
		],
		datosAcademicos: [
			{
				type: 'text',
				label: 'Carrera Universitaria',
				name: 'carreraUniversitaria',
				value: $agenteStore.carreraUniversitaria || '',
				required: false,
				validators: []
			},
			{
				type: 'text',
				label: 'Carrera Postgrado',
				name: 'carreraPostgrado',
				value: $agenteStore.carreraPostgrado || '',
				required: false,
				validators: []
			},
			{
				type: 'select',
				label: 'Carrera universitaria Finalizada',
				name: 'carreraFinalizada',
				value: $agenteStore.carreraFinalizada || false,
				required: true,
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				],
				validators: [validateEmptyInput]
			}
		],
		datosRecorrido: [
			{
				type: 'select',
				label: 'tipo de contratacion',
				name: 'tipoContratacion',
				value: $agenteStore.tipoContratacion || '',
				required: true,
				options: [
					{
						name: 'Contrato de locacion de servicios',
						value: 'CLS'
					},
					{
						name: 'Planta transitorio temporaria',
						value: 'PTT'
					},
					{
						name: 'Planta permanente',
						value: 'PP'
					}
				],
				validators: [validateEmptyInput]
			},
			{
				type: 'number',
				label: 'categoria',
				name: 'categoria',
				value: $agenteStore.categoria || '',
				required: false,
				validators: [
					(value: number) => {
						if (
							($agenteStore.tipoContratacion == 'PTT' || $agenteStore.tipoContratacion == 'PP') &&
							(value.toString().length <= 5 || value.toString().length >= 21)
						)
							return {
								message: 'La categoria debe ser un numero entre 5 y 21',
								status: false
							};
					},
					(value: number) => {
						if (
							($agenteStore.tipoContratacion == 'PTT' || $agenteStore.tipoContratacion == 'PP') &&
							(value.toString() == '' || value == null)
						) {
							return {
								message: 'Si el tipo de contratacion es PTT o PP, este campo es obligatorio',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'select',
				label: 'agrupamiento',
				name: 'agrupamiento',
				value: $agenteStore.agrupamiento || '',
				required: false,
				options: [
					{ name: 'tecnico', value: 'tecnico' },
					{ name: 'administrativo', value: 'administrativo' },
					{ name: 'profesional', value: 'profesional' }
				],
				validators: [
					(value: any) => {
						if (
							($agenteStore.tipoContratacion == 'PTT' || $agenteStore.tipoContratacion == 'PP') &&
							(value == '' || value == null)
						) {
							return {
								message: 'Si el tipo de contratacion es PTT o PP, este campo es obligatorio',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'number',
				label: 'Legajos (SIAPE)',
				name: 'numSiape',
				value: $agenteStore.numSiape || '',
				required: false,
				validators: [
					(value: any) => {
						if (
							($agenteStore.tipoContratacion == 'PTT' || $agenteStore.tipoContratacion == 'PP') &&
							(value == '' || value == null)
						) {
							return {
								message: 'Si el tipo de contratacion es PTT o PP, este campo es obligatorio',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'text',
				label: 'referencia de baja',
				name: 'referenciaBaja',
				value: $agenteStore.referenciaBaja || '',
				required: false,
				validators: []
			},
			{
				type: 'select',
				label: 'obra social activa',
				name: 'obraSocialActiva',
				value: $agenteStore.obraSocialActiva,
				required: false,
				validators: [
					(value: any) => {
						if (
							($agenteStore.tipoContratacion == 'PTT' || $agenteStore.tipoContratacion == 'PP') &&
							(value == '' || value == null)
						) {
							return {
								message: 'Si el tipo de contratacion es PTT o PP, este campo es obligatorio',
								status: false
							};
						}
					}
				],
				options: [
					{
						name: 'Si',
						value: true
					},
					{
						name: 'No',
						value: false
					}
				]
			},
			{
				type: 'date',
				label: 'fecha de alta CLS',
				name: 'fechaAltaCLS',
				value: $agenteStore.fechaAltaCLS || '',
				required: false,
				hidden: tipoContratacion.CLS,
				validators: [
					(value: any) => {
						if ($agenteStore.tipoContratacion == 'CLS' && (value == '' || value == null)) {
							return {
								message: 'Si el tipo de contratacion es CLS, este campo es obligatorio',
								status: false
							};
						}
					},
					(value: any) => {
						if (
							$agenteStore.fechaBajaCLS &&
							new Date($agenteStore.fechaBajaCLS).getTime() < new Date(value).getTime()
						) {
							return {
								message: 'La fecha de alta no puede ser posterior a la fecha de baja',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'date',
				label: 'fecha de baja CLS',
				name: 'fechaBajaCLS',
				value: $agenteStore.fechaBajaCLS || '',
				required: false,
				hidden: tipoContratacion.CLS,
				validators: [
					(value: any) => {
						if (
							$agenteStore.fechaAltaCLS &&
							$agenteStore.tipoContratacion !== 'CLS' &&
							(value == '' || value == null)
						) {
							return {
								message:
									'Si se va a actualizar el tipo de contratacion es necesario que se especifique la fecha de baja de la contratacion anterior',
								status: false
							};
						}
					}
				]
			},

			//EX-2023-00000153- -GDEBA-TESTGDEBA
			{
				type: 'text',
				label: 'expediente de alta CLS',
				name: 'expedienteAltaCLS',
				value: $agenteStore.expedienteAltaCLS || '',
				required: false,
				hidden: tipoContratacion.CLS,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{8}[-]\s[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'CLS' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO- -ECOSISTEMA-REPARTICION)',
								status: false
							};
					}
				]
			},
			{
				type: 'text',
				label: 'acto de alta CLS',
				name: 'actoAltaCLS',
				value: $agenteStore.actoAltaCLS || '',
				required: false,
				hidden: tipoContratacion.CLS,
				validators: [
					(value: any) => {
						const regex = /[A-Z]*[-]\d{4}[-]\d{8}[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'CLS' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO-ECOSISTEMA-REPARTICION)',
								status: false
							};
					}
				]
			},
			{
				type: 'date',
				label: 'fecha de alta PTT',
				name: 'fechaAltaPTT',
				value: $agenteStore.fechaAltaPTT || '',
				required: false,
				hidden: tipoContratacion.PTT,
				validators: [
					(value: any) => {
						if ($agenteStore.tipoContratacion == 'PTT' && (value == '' || value == null)) {
							return {
								message: 'Si el tipo de contratacion es PTT, este campo es obligatorio',
								status: false
							};
						}
					},
					(value: any) => {
						if (
							$agenteStore.fechaBajaPTT &&
							new Date($agenteStore.fechaBajaPTT).getTime() < new Date(value).getTime()
						) {
							return {
								message: 'La fecha de alta no puede ser posterior a la fecha de baja',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'date',
				label: 'fecha de baja PTT',
				name: 'fechaBajaPTT',
				value: $agenteStore.fechaBajaPTT || '',
				required: false,
				hidden: tipoContratacion.PTT,
				validators: [
					(value: any) => {
						if (
							$agenteStore.fechaAltaPTT &&
							$agenteStore.tipoContratacion !== 'PTT' &&
							(value == '' || value == null)
						) {
							return {
								message:
									'Si se va a actualizar el tipo de contratacion es necesario que se especifique la fecha de baja de la contratacion anterior',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'text',
				label: 'expediente de alta PTT',
				name: 'expedienteAltaPTT',
				value: $agenteStore.expedienteAltaPTT || '',
				required: false,
				hidden: tipoContratacion.PTT,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{8}[-]\s[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'PTT' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO- -ECOSISTEMA-REPARTICION)',
								status: false
							};
					}
				]
			},
			{
				type: 'text',
				label: 'acto de alta PTT',
				name: 'actoAltaPTT',
				value: $agenteStore.actoAltaPTT || '',
				required: false,
				hidden: tipoContratacion.PTT,
				validators: [
					(value: any) => {
						const regex = /[A-Z]*[-]\d{4}[-]\d{8}[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'PTT' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO-ECOSISTEMA-REPARTICION)',
								status: false
							};
					}
				]
			},
			{
				type: 'date',
				label: 'fecha de alta PP',
				name: 'fechaAltaPP',
				value: $agenteStore.fechaAltaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: [
					(value: any) => {
						if ($agenteStore.tipoContratacion == 'PP' && (value == '' || value == null)) {
							return {
								message: 'Si el tipo de contratacion es PP, este campo es obligatorio',
								status: false
							};
						}
					},
					(value: any) => {
						if (
							$agenteStore.fechaBajaPP &&
							new Date($agenteStore.fechaBajaPP).getTime() < new Date(value).getTime()
						) {
							return {
								message: 'La fecha de alta no puede ser posterior a la fecha de baja',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'date',
				label: 'fecha de baja PP',
				name: 'fechaBajaPP',
				value: $agenteStore.fechaBajaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: []
			},
			{
				type: 'text',
				label: 'expediente de alta PP',
				name: 'expedienteAltaPP',
				value: $agenteStore.expedienteAltaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{8}[-]\s[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'PP' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO- -ECOSISTEMA-REPARTICION)',
								status: false
							};
					}
				]
			},
			{
				type: 'text',
				label: 'acto de alta PP',
				name: 'actoAltaPP',
				value: $agenteStore.actoAltaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: [
					(value: any) => {
						const regex = /[A-Z]*[-]\d{4}[-]\d{8}[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'PP' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO-ECOSISTEMA-REPARTICION)',
								status: false
							};
					}
				]
			},
			{
				type: 'number',
				label: 'antiguedad externa',
				name: 'antiguedadExterna',
				value: $agenteStore.antiguedadExterna || 0,
				required: true,
				validators: [validateEmptyInput]
			}
		]
	};

	const validateForm = (e: CustomEvent) => {
		validate[e.detail.form] = e.detail.status;
		disabledbutton = true
			? !(
					validate.datosPersonales &&
					validate.datosSalud &&
					validate.datosAcademicos &&
					validate.datosRecorrido
			  )
			: false;
	};

	const changeInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		let value: string | number | boolean = target.value;
		if (target.value == 'true' || target.value == 'false') value = target.value == 'true';

		if (
			target.type === 'number' ||
			(target.type === 'select-one' && typeof value === 'string' && parseInt(value))
		)
			value = parseInt(value);
		agenteStore.update((agente) => {
			agente[target.name as string] = value;
			return agente;
		});
	};

	const showValidations = (e: CustomEvent) => {
		success = false;
		showErrors = true;
		errorsMessage = [];
		errorsMessage.push(e.detail.message);
	};
	const showSuccess = (e: CustomEvent) => {
		successMessage.title = `Agente ${action === 'create' ? 'Creado' : 'Actualizado'}`;
		successMessage.description = `El agente se ${
			action === 'create' ? 'creó' : 'actualizó'
		} correctamente!`;
		success = true;
		showErrors = false;
	};
</script>

<div class="p-2 flex flex-col items-center w-full scrollbar-thin scrollbar-w-10 overflow-y-scroll">
	<FormDrawer
		{components}
		{action}
		disabled={disabledbutton}
		extraValidations={veryComplexValidators}
		on:error={showValidations}
		on:valid={showSuccess}
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
						validateAllInputs={!validate[formName]}
					/>
				</div>
			{/if}
		{/each}
	</FormDrawer>
	{#if showErrors}
		<div class=" w-full p-3 m-5 flex flex-col gap-5">
			{#each errorsMessage as error}
				<div
					class="flex bg-white shadow-md p-2 justify-arround items-center gap-2 rounded-lg dark:bg-stone-800 dark:border dark:border-stone-700"
				>
					<Icon src={ExclamationCircle} class="text-rose-500 w-6 h-6" />
					<div class="w-5/6">
						<p class="text-stone-700 dark:text-stone-200 text-sm">{error.error}</p>
						<p class="text-stone-500 text-sm">{error.description}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	{#if success}
		<div class=" w-full p-3 m-5 flex flex-col gap-5">
			<div
				class="flex bg-white shadow-md p-2 justify-arround items-center gap-2 rounded-lg dark:bg-stone-800 dark:border dark:border-stone-700"
			>
				<Icon src={CheckCircle} class="text-lime-500 w-6 h-6" />
				<div class="w-5/6">
					<p class="text-stone-700 dark:text-stone-200 text-sm">{successMessage.title}</p>
					<p class="text-stone-500 text-sm">{successMessage.description}</p>
				</div>
			</div>
		</div>
	{/if}
</div>
