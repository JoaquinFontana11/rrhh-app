import type { Actions, Action } from './$types';
import { supabase } from '$lib/supabaseClient';
import licenciasRuleEngine from '$lib/server/ruleEngine';
import { error } from '@sveltejs/kit';

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
		const { data: dataAusentes } = await supabase
			.from('licencia')
			.select('*')
			.gte('fechaInicio', `${date.getFullYear()}-01-01`)
			.eq('agente', licencia.agente);

		const flags = licenciasRuleEngine.ausenteRules({ licencia, dataAusentes });

		console.log(flags);

		const reject = Object.entries(flags).some((flag) => !flag[1]);

		console.log(Object.entries(flags).filter((flag) => !flag[1]));

		if (reject)
			throw error(400, {
				message: JSON.stringify({ flags, messages: licenciasRuleEngine.messages })
			});
	}

	if (objetoLleno(datosAcademicos)) {
		let { data }: { data: any; error: any } = await supabase
			.from('licenciaAcademica')
			.insert(datosAcademicos)
			.select();

		licencia.datosAcademicos = data[0].id;
	}
	if (objetoLleno(datosSalud)) {
		let { data }: { data: any } = await supabase.from('licenciaSalud').insert(datosSalud).select();

		licencia.datosSalud = data[0].id;
	}
	if (objetoLleno(datosVacaciones)) {
		let { data }: { data: any } = await supabase
			.from('licenciaVacaciones')
			.insert(datosVacaciones)
			.select();

		licencia.datosVacaciones = data[0].id;
	}
	if (objetoLleno(datosTeletrabajo)) {
		let { data }: { data: any } = await supabase
			.from('licenciaTeletrabajo')
			.insert(datosTeletrabajo)
			.select();

		licencia.datosTeletrabajo = data[0].id;
	}

	await supabase.from('licencia').insert(licencia);
};

const objetoLleno = (obj) => {
	return !Object.values(obj).some((value) => value == undefined || value == '');
};

export const actions: Actions = { create };
