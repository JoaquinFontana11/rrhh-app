import type { Actions, Action } from './$types';
import { supabase } from '$lib/supabaseClient';

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

	console.log(datosAcademicos, datosSalud, datosTeletrabajo, datosVacaciones);
	console.log(
		objetoLleno(datosAcademicos),
		objetoLleno(datosSalud),
		objetoLleno(datosTeletrabajo),
		objetoLleno(datosVacaciones)
	);

	if (objetoLleno(datosAcademicos)) {
		let { data, error }: { data: any; error: any } = await supabase
			.from('licenciaAcademica')
			.insert(datosAcademicos)
			.select();

		console.log(error);
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

	const { error } = await supabase.from('licencia').insert(licencia);
	console.log(error, licencia);
};

const objetoLleno = (obj) => {
	return !Object.values(obj).some((value) => value == undefined || value == '');
};

export const actions: Actions = { create };
