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
		ErrorObject,
		Licencia
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
			.select('*,direccion(*)')
			.in('rol', [
				'Director',
				'Directora',
				'director',
				'directora',
				'Coordinador',
				'Coordinadora',
				'coordinador',
				'coordinadora'
			]);

		if (!res.data) return;

		let agentes: AgenteSupabase[] = res.data;

		superioresDirectos = agentes
			.filter((agente) => {
				const direccionAgente = agente.direccion as DireccionSupabase;
				return direccionAgente?.id == direccion || agente.id === 9;
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
		datosPersonales: 'Datos personales',
		datosSalud: 'Datos de salud',
		datosAcademicos: 'Datos academicos',
		datosRecorrido: 'Datos institucionales'
	};

	let veryComplexValidators: FunctionsObject = {
		/* datosAcademicos: (components: IComponent) => {
			return components[2].value && components[0].value === ''
				? {
						message: {
							error: 'Datos Academicos',
							description: 'Si tiene una carrera Finalizada, debe especificar cual'
						},
						status: true
				  }
				: { message: '', status: false };
		} */
	};

	let components: IComponentObject;
	$: components = {
		datosPersonales: [
			{
				type: 'text',
				label: 'Nombre Completo',
				name: 'nombreCompleto',
				value: $agenteStore.nombreCompleto || '',
				required: true,
				validators: [validateEmptyInput]
			},
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
				],
				disabled: action === 'create' ? false : true
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
				label: 'Domicilio',
				name: 'domicilio',
				value: $agenteStore.domicilio || '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'email',
				label: 'Email Personal',
				name: 'emailPersonal',
				value: $agenteStore.emailPersonal || '',
				required: true,
				validators: [validateEmptyInput, validateInputEmail]
			},
			{
				type: 'number',
				label: 'Telefono',
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
				label: 'Curriculum',
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
				label: 'Genero',
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
				label: 'Beneficio de guarderia',
				name: 'beneficioGuarderia',
				value: $agenteStore.beneficioGuarderia || false,
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
				label: 'Direccion de linea',
				name: 'direccion',
				value: $agenteStore.direccion?.id || $agenteStore.direccion || '',
				required: true,
				options: direcciones,
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
				label: 'Superior Directo',
				name: 'superiorDirecto',
				value: $agenteStore.superiorDirecto?.id || $agenteStore.superiorDirecto || '',
				required: true,
				options: superioresDirectos,
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
				type: 'email',
				label: 'Email Institucional',
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
			}
		],
		datosSalud: [
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
				type: 'select',
				label: 'Obra social activa',
				name: 'obraSocialActiva',
				value: $agenteStore.obraSocialActiva || false,
				required: false,
				validators: [],
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
				type: 'select',
				label: 'Grupo y factor sanguineo',
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
				label: 'Medicamentos',
				name: 'medicamentos',
				value: $agenteStore.medicamentos || '',
				required: false,
				validators: []
			},
			{
				type: 'text',
				label: 'Consideraciones',
				name: 'consideracion',
				value: $agenteStore.consideracion || '',
				required: false,
				validators: []
			},
			{
				type: 'text',
				label: 'Nombre de contacto de emergencia',
				name: 'nombreContactoEmergencia',
				value: $agenteStore.nombreContactoEmergencia || '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'number',
				label: 'Telefono de contacto de emergencia',
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
				validators: [
					validateEmptyInput,
					(value: boolean) => {
						if (value && !$agenteStore.carreraUniversitaria)
							return {
								message: 'Si tiene una carrera Finalizada, debe especificar cual',
								status: false
							};
					}
				]
			}
		],
		datosRecorrido: [
			{
				type: 'select',
				label: 'Tipo de contratacion',
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
				type: 'date',
				label: 'Fecha de alta CLS',
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
				type: 'text',
				label: 'Expediente de alta CLS',
				name: 'expedienteAltaCLS',
				value: $agenteStore.expedienteAltaCLS || '',
				required: false,
				hidden: tipoContratacion.CLS,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{1,10}[-]\s[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'CLS' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO- -ECOSISTEMA-REPARTICION)',
								status: false
							};
					},
					validateEmptyInput
				]
			},
			{
				type: 'text',
				label: 'Acto de alta CLS',
				name: 'actoAltaCLS',
				value: $agenteStore.actoAltaCLS || '',
				required: false,
				hidden: tipoContratacion.CLS,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{1,10}[-]\s[-][A-Z]*[-][A-Z]*/;
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
				type: 'date',
				label: 'Fecha de baja CLS',
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
			{
				type: 'text',
				label: 'Referencia de baja CLS',
				name: 'referenciaBajaCLS',
				value: $agenteStore.referenciaBajaCLS || '',
				required: false,
				hidden: tipoContratacion.CLS,
				validators: [
					(value: any) => {
						if ($agenteStore.fechaBajaCLS && !value)
							return { message: 'Debe especificar una referecia a la baja CLS', status: false };
					}
				]
			},
			{
				type: 'number',
				label: 'Antiguedad externa CLS',
				name: 'antiguedadExternaCLS',
				value: $agenteStore.antiguedadExternaCLS || 0,
				required: false,
				hidden: tipoContratacion.CLS,
				validators: []
			},

			{
				type: 'number',
				label: 'Categoria PP',
				name: 'categoriaPP',
				value: $agenteStore.categoriaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: [
					(value: number) => {
						if ($agenteStore.tipoContratacion == 'PP' && (value < 5 || value > 21))
							return {
								message: 'La categoria debe ser un numero entre 5 y 21',
								status: false
							};
					},
					(value: number) => {
						if (
							$agenteStore.tipoContratacion == 'PP' &&
							(value.toString() == '' || value == null)
						) {
							return {
								message: 'Si el tipo de contratacion es PP, este campo es obligatorio',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'text',
				label: 'Agrupamiento PP',
				name: 'agrupamientoPP',
				value: $agenteStore.agrupamientoPP || '',
				options: [
					{ name: 'tecnico', value: 'tecnico' },
					{ name: 'administrativo', value: 'administrativo' },
					{ name: 'profesional', value: 'profesional' }
				],
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
					}
				]
			},
			{
				type: 'number',
				label: 'legajo (SIAPE) PP',
				name: 'numSiapePP',
				value: $agenteStore.numSiapePP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: []
			},
			{
				type: 'date',
				label: 'Fecha de alta PP',
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
				type: 'text',
				label: 'Expediente de alta PP',
				name: 'expiednteAltaPP',
				value: $agenteStore.expedienteAltaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{1,10}[-]\s[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'PP' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO- -ECOSISTEMA-REPARTICION)',
								status: false
							};
					},
					validateEmptyInput
				]
			},
			{
				type: 'text',
				label: 'Acto de alta PP',
				name: 'actoAltaPP',
				value: $agenteStore.actoAltaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{1,10}[-]\s[-][A-Z]*[-][A-Z]*/;
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
				type: 'date',
				label: 'Fecha de baja PP',
				name: 'fechaBajaPP',
				value: $agenteStore.fechaBajaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: [
					(value: any) => {
						if (
							$agenteStore.fechaAltaPP &&
							$agenteStore.tipoContratacion !== 'PP' &&
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
				label: 'Referencia de baja PP',
				name: 'referenciaBajaPP',
				value: $agenteStore.referenciaBajaPP || '',
				required: false,
				hidden: tipoContratacion.PP,
				validators: [
					(value: any) => {
						if ($agenteStore.fechaBajaPP && !value)
							return { message: 'Debe especificar una referecia a la baja PP', status: false };
					}
				]
			},
			{
				type: 'number',
				label: 'Antiguedad externa PP',
				name: 'antiguedadExternaPP',
				value: $agenteStore.antiguedadExternaPP || 0,
				required: false,
				hidden: tipoContratacion.PP,
				validators: []
			},

			{
				type: 'number',
				label: 'Categoria PTT',
				name: 'categoriaPTT',
				value: $agenteStore.categoriaPTT || '',
				required: false,
				hidden: tipoContratacion.PTT,
				validators: [
					(value: number) => {
						if ($agenteStore.tipoContratacion == 'PTT' && (value < 5 || value > 21))
							return {
								message: 'La categoria debe ser un numero entre 5 y 21',
								status: false
							};
					},
					(value: number) => {
						if (
							$agenteStore.tipoContratacion == 'PTT' &&
							(value.toString() == '' || value == null)
						) {
							return {
								message: 'Si el tipo de contratacion es PTT, este campo es obligatorio',
								status: false
							};
						}
					}
				]
			},
			{
				type: 'text',
				label: 'Agrupamiento PTT',
				name: 'agrupamientoPTT',
				value: $agenteStore.agrupamientoPTT || '',
				options: [
					{ name: 'tecnico', value: 'tecnico' },
					{ name: 'administrativo', value: 'administrativo' },
					{ name: 'profesional', value: 'profesional' }
				],
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
					}
				]
			},
			{
				type: 'number',
				label: 'Legajo (SIAPE) PTT',
				name: 'numSiapePTT',
				value: $agenteStore.numSiapePTT || '',
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
					}
				]
			},
			{
				type: 'date',
				label: 'Fecha de alta PTT',
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
				type: 'text',
				label: 'Expediente de alta PTT',
				name: 'expedienteAltaPTT',
				value: $agenteStore.expedienteAltaPTT || '',
				required: false,
				hidden: tipoContratacion.PTT,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{1,10}[-]\s[-][A-Z]*[-][A-Z]*/;
						if ($agenteStore.tipoContratacion == 'PTT' && !regex.test(value) && value !== '')
							return {
								message:
									'No cumple con el formato de expediente (EX-AÑO-NUMERO- -ECOSISTEMA-REPARTICION)',
								status: false
							};
					},
					validateEmptyInput
				]
			},
			{
				type: 'text',
				label: 'Acto de alta PTT',
				name: 'actoAltaPTT',
				value: $agenteStore.actoAltaPTT || '',
				required: false,
				hidden: tipoContratacion.PTT,
				validators: [
					(value: any) => {
						const regex = /[E][X][-]\d{4}[-]\d{1,10}[-]\s[-][A-Z]*[-][A-Z]*/;
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
				type: 'date',
				label: 'Fecha de baja PTT',
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
				label: 'Referencia de baja PTT',
				name: 'referenciaBajaPTT',
				value: $agenteStore.referenciaBajaPTT || '',
				required: false,
				hidden: tipoContratacion.PTT,
				validators: [
					(value: any) => {
						if ($agenteStore.fechaBajaPTT && !value)
							return { message: 'Debe especificar una referecia a la baja PTT', status: false };
					}
				]
			},
			{
				type: 'number',
				label: 'Antiguedad externa PTT',
				name: 'antiguedadExternaPTT',
				value: $agenteStore.antiguedadExternaPTT || 0,
				required: false,
				hidden: tipoContratacion.PTT,
				validators: []
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
		if (Array.isArray(e.detail.message)) errorsMessage = e.detail.message;
		else errorsMessage.push(e.detail.message);
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
					<Icon src={ExclamationCircle} class="text-DPMA-Error w-6 h-6" />
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
				<Icon src={CheckCircle} class="text-DPMA-Succes w-6 h-6" />
				<div class="w-5/6">
					<p class="text-stone-700 dark:text-stone-200 text-sm">{successMessage.title}</p>
					<p class="text-stone-500 text-sm">{successMessage.description}</p>
				</div>
			</div>
		</div>
	{/if}
</div>
