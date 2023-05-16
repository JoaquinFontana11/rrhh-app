import type { Actions, Action } from './$types';
import { supabase } from '$lib/supabaseClient';
import licenciasRuleEngine from '$lib/server/ruleEngine';
import { error, fail } from '@sveltejs/kit';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Licencia } from '$lib/types';
import { current_component } from 'svelte/internal';

const create: Action = async ({ request }) => {
	const data = await request.formData();

	const licencia = {
		agente: data.get('agente'),
		fechaInicio: data.get('fechaInicio'),
		fechaFin: data.get('fechaFin'),
		tipo: data.get('tipo'),
		observaciones: data.get('observaciones'),
		autorizadoSiape: data.get('autorizadoSiape'),
		datosAcademicos: null,
		datosSalud: null,
		datosTeletrabajo: null,
		datosVacaciones: null
	};

	const datosAcademicos = {
		ultimaMateria: data.get('ultimaMateria')
	};
	const datosSalud = {
		concepto: data.get('concepto')
	};
	const datosTeletrabajo = {
		mailAutorizado: data.get('mailAutorizado'),
		comunicacionInicio: data.get('comunicacionInicio'),
		comunicoInicioA: data.get('comunicoInicioA'),
		comunicacionFin: data.get('comunicacionFin'),
		comunicoFinA: data.get('comunicoFinA'),
		conectadoATeams: data.get('conectadoATeams')
	};
	const datosVacaciones = {
		periodo: data.get('periodo')
	};

	const date = new Date();
	// ejecutamos el motor de reglas para validar la licencia

	if (licencia.tipo == 'ausente') {
		// obtenemos todos los ausentes con aviso en lo que va del año
		let { data: dataAusentes } = await supabase
			.from('licencia')
			.select('*')
			.gte('fechaInicio', `${date.getFullYear()}-01-01`)
			.eq('agente', licencia.agente)
			.eq('tipo', 'ausente')
			.neq('borrado', true);

		dataAusentes = dataAusentes || [];
		const flags = licenciasRuleEngine.ausenteRules({ licencia, dataAusentes });

		const reject = Object.entries(flags).some((flag) => !flag[1]);
		if (reject)
			throw error(400, {
				message: JSON.stringify({ flags, messages: licenciasRuleEngine.messages })
			});
	}

	if (licencia.tipo == 'academica') {
		// obtenemos todas las licencias academicas en lo que va del año
		let { data: dataAcademica } = await supabase
			.from('licencia')
			.select('*, datosAcademicos(*)')
			.gte('fechaInicio', `${date.getFullYear()}-01-01`)
			.eq('agente', licencia.agente)
			.eq('tipo', 'academica')
			.neq('borrado', true);

		dataAcademica = dataAcademica || [];
		const flags = licenciasRuleEngine.academicoRules({ licencia, dataAcademica });

		const reject = Object.entries(flags).some((flag) => !flag[1]);

		if (reject)
			throw error(400, {
				message: JSON.stringify({ flags, messages: licenciasRuleEngine.messages })
			});
	}

	if (licencia.tipo == 'vacaciones') {
		// obtenemos todas las vacaciones en lo que va del año
		let { data: dataVacaciones } = await supabase
			.from('licencia')
			.select('*, datosVacaciones(*)')
			.gte('fechaInicio', `${date.getFullYear()}-01-01`)
			.eq('agente', licencia.agente)
			.eq('tipo', 'vacaciones')
			.neq('borrado', true);

		let { data: agente }: { data: any } = await supabase
			.from('agente')
			.select('*, datosRecorrido(*)')
			.eq('id', licencia.agente);

		dataVacaciones = dataVacaciones || [];
		const flags = licenciasRuleEngine.vacacionesRules({
			licencia,
			dataVacaciones,
			datosVacacionesActual: datosVacaciones,
			agente: agente[0]
		});

		const reject = Object.entries(flags).some((flag) => !flag[1]);

		if (reject)
			throw error(400, {
				message: JSON.stringify({ flags, messages: licenciasRuleEngine.messages })
			});
	}

	if (objetoLleno(datosAcademicos) && data.get('tipo') == 'academica') {
		let { data, error }: { data: any; error: any } = await supabase
			.from('licenciaAcademica')
			.insert(datosAcademicos)
			.select();

		licencia.datosAcademicos = data[0].id;
	}
	if (objetoLleno(datosSalud) && data.get('tipo') == 'salud') {
		let { data }: { data: any } = await supabase.from('licenciaSalud').insert(datosSalud).select();

		licencia.datosSalud = data[0].id;
	}
	if (objetoLleno(datosVacaciones) && data.get('tipo') == 'vacaciones') {
		let { data }: { data: any } = await supabase
			.from('licenciaVacaciones')
			.insert(datosVacaciones)
			.select();

		licencia.datosVacaciones = data[0].id;
	}
	if (objetoLleno(datosTeletrabajo) && data.get('tipo') == 'teletrabajo') {
		let { data }: { data: any } = await supabase
			.from('licenciaTeletrabajo')
			.insert(datosTeletrabajo)
			.select();

		licencia.datosTeletrabajo = data[0].id;
	}

	await supabase.from('licencia').insert(licencia);
};

const objetoLleno = (obj: object) => {
	return !Object.values(obj).some((value) => value == undefined || value == '');
};

const update: Action = async ({ request }) => {
	const data = await request.formData();

	const licencia = {
		id: data.get('id'),
		agente: data.get('agente'),
		fechaInicio: data.get('fechaInicio'),
		fechaFin: data.get('fechaFin'),
		tipo: data.get('tipo'),
		observaciones: data.get('observaciones'),
		autorizadoSiape: data.get('autorizadoSiape'),
		datosAcademicos: null,
		datosSalud: null,
		datosTeletrabajo: null,
		datosVacaciones: null
	};

	const datosAcademicos = {
		ultimaMateria: data.get('ultimaMateria')
	};
	const datosSalud = {
		concepto: data.get('concepto')
	};
	const datosTeletrabajo = {
		mailAutorizado: data.get('mailAutorizado'),
		comunicacionInicio: data.get('comunicacionInicio'),
		comunicoInicioA: data.get('comunicoInicioA'),
		comunicacionFin: data.get('comunicacionFin'),
		comunicoFinA: data.get('comunicoFinA'),
		conectadoATeams: data.get('conectadoATeams')
	};
	const datosVacaciones = {
		periodo: data.get('periodo')
	};

	const { data: currentLicencia, error: errorLicencia }: PostgrestResponse<any> = await supabase
		.from('licencia')
		.select('*')
		.eq('id', licencia.id)
		.limit(1)
		.single();

	if (errorLicencia) {
		const message = {
			error: 'Datos generales de la licencia',
			description: errorLicencia.message + ''
		};
		throw error(400, { message: message });
	}

	if (currentLicencia.tipo === 'academica') {
		const { data: currentDatosAcademicos, error: errorDatosAcademicos }: PostgrestResponse<any> =
			await supabase
				.from('licenciaAcademica')
				.select('*')
				.eq('id', currentLicencia.datosAcademicos)
				.limit(1)
				.single();

		if (errorDatosAcademicos) {
			const message = { error: 'Datos Academicos', description: errorDatosAcademicos.message + '' };
			throw error(400, { message: message });
		}

		const { error: updateDatosAcademicosError }: PostgrestResponse<any> = await supabase
			.from('licenciaAcademica')
			.update(datosAcademicos)
			.eq('id', currentDatosAcademicos.id);

		if (updateDatosAcademicosError) {
			const message = {
				error: 'Datos Academicos',
				description: updateDatosAcademicosError.message + ''
			};
			throw error(400, { message: message });
		}
		licencia.datosAcademicos = currentDatosAcademicos.id;
	} else if (currentLicencia.tipo === 'salud') {
		const { data: currentDatosSalud, error: errorDatosSalud }: PostgrestResponse<any> =
			await supabase
				.from('licenciaSalud')
				.select('*')
				.eq('id', currentLicencia.datosSalud)
				.limit(1)
				.single();

		if (errorDatosSalud) {
			const message = { error: 'Datos de Salud', description: errorDatosSalud.message + '' };
			throw error(400, { message: message });
		}

		const { error: updateDatosSaludError }: PostgrestResponse<any> = await supabase
			.from('licenciaSalud')
			.update(datosSalud)
			.eq('id', currentDatosSalud.id);

		if (updateDatosSaludError) {
			const message = {
				error: 'Datos de Salud',
				description: updateDatosSaludError.message + ''
			};
			throw error(400, { message: message });
		}
		licencia.datosSalud = currentDatosSalud.id;
	} else if (currentLicencia.tipo === 'teletrabajo') {
		const { data: currentDatosTeletrabajo, error: errorDatosTeletrabajo }: PostgrestResponse<any> =
			await supabase
				.from('licenciaTeletrabajo')
				.select('*')
				.eq('id', currentLicencia.datosTeletrabajo)
				.limit(1)
				.single();

		if (errorDatosTeletrabajo) {
			const message = {
				error: 'Datos Teletrabajo',
				description: errorDatosTeletrabajo.message + ''
			};
			throw error(400, { message: message });
		}

		const { error: updateDatosTeletrabajoError }: PostgrestResponse<any> = await supabase
			.from('licenciaTeletrabajo')
			.update(datosTeletrabajo)
			.eq('id', currentDatosTeletrabajo.id);

		if (updateDatosTeletrabajoError) {
			const message = {
				error: 'Datos Teletrabajo',
				description: updateDatosTeletrabajoError.message + ''
			};
			throw error(400, { message: message });
		}
		licencia.datosTeletrabajo = currentDatosTeletrabajo.id;
	} else if (currentLicencia.tipo === 'vacaciones') {
		const { data: currentDatosVacaciones, error: errorDatosVacaciones }: PostgrestResponse<any> =
			await supabase
				.from('licenciaVacaciones')
				.select('*')
				.eq('id', currentLicencia.datosVacaciones)
				.limit(1)
				.single();

		if (errorDatosVacaciones) {
			const message = {
				error: 'Datos Vacaciones',
				description: errorDatosVacaciones.message + ''
			};
			throw error(400, { message: message });
		}

		const { error: updateDatosVacacionesError }: PostgrestResponse<any> = await supabase
			.from('licenciaVacaciones')
			.update(datosVacaciones)
			.eq('id', currentDatosVacaciones.id);

		if (updateDatosVacacionesError) {
			const message = {
				error: 'Datos Vacaiones',
				description: updateDatosVacacionesError.message + ''
			};
			throw error(400, { message: message });
		}
		licencia.datosVacaciones = currentDatosVacaciones.id;
	}

	const { error: updateLicenciaError }: PostgrestResponse<any> = await supabase
		.from('licencia')
		.update(licencia)
		.eq('id', currentLicencia.id);

	if (updateLicenciaError) {
		const message = {
			error: 'Datos generales de la licencia',
			description: updateLicenciaError.message + ''
		};
		throw error(400, { message: message });
	}
};

export const actions: Actions = { create, update };
