import type { PageLoad } from './$types';
import { supabase, execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
import notasStore from '$lib/stores/notasStore';
import tipoLicenciaStore from '$lib/stores/licencias/tipoLicenciaStore';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
	const { data }: { data: any } = await supabase
		.from('notas')
		.select('*')
		.ilike('modulo', `%${url.pathname}%`);
	notasStore.update((n) => data);

	const { data: agentes } = await supabase.from('agente').select('*');
	//const { data: licencias } = await supabase.from('licencia').select('*');
	let { count: lastPage } = await supabase
		.from('licencia')
		.select('*', { count: 'exact' })
		.eq('tipo', 'ausente');
	console.log(tipoLicenciaStore);
	const licencias = await reloadData(0, { field: 'fechaInicio', direction: true }, [], 10);
	let { data: fields } = await supabase
		.from('licencia')
		.select(' fechaInicio, fechaFin, observaciones, autorizadoSiape')
		.range(0, 1);

	fields = flatSupabaseResponse(fields);

	return {
		licencias: licencias.data,
		agentes,
		lastPage: Math.trunc((lastPage as number) / 10),
		reloadData,
		calcLastPage,
		fields: Object.entries(fields[0]).map((entries) => entries[0])
	};
};

const reloadData = async (
	page: number,
	order = { field: 'fechaInicio', direction: true },
	filters: any[],
	cantPage: number,
	tipo: string = 'ausente'
) => {
	console.log(cantPage);
	const query = `supabase.from('licencia').select(' fechaInicio, fechaFin, tipo, observaciones, autorizadoSiape, agente(nombreCompleto)${
		tipo == 'academica'
			? ', datosAcademicos(*)'
			: tipo == 'salud'
			? ', datosSalud(*)'
			: tipo == 'teletrabajo'
			? ', datosTeletrabajo(*)'
			: tipo == 'vacaciones'
			? ', datosVacaciones(*)'
			: ''
	}')`;

	const resSupabase = await execSupabaseQuery(query, page, filters, order, cantPage);

	resSupabase.data = flatSupabaseResponse(resSupabase.data);
	return resSupabase;
};

const calcLastPage = async (
	order = { field: 'fechaInicio', direction: true },
	filters: any[],
	tipo: string = 'ausente'
) => {
	console.log(tipo);
	let query = `supabase.from('licencia').select(' fechaInicio, fechaFin, tipo, observaciones, autorizadoSiape, agente(nombreCompleto)${
		tipo == 'academica'
			? ', datosAcademicos(*)'
			: tipo == 'salud'
			? ', datosSalud(*)'
			: tipo == 'teletrabajo'
			? ', datosTeletrabajo(*)'
			: tipo == 'vacaciones'
			? ', datosVacaciones(*)'
			: ''
	}', {count: 'exact'})`;
	console.log(query);
	filters.map((f) => {
		query += `.${f.filter}('${f.field}', '${f.value}')`;
	});
	query += `.order('${order.field}', {ascending: ${order.direction}})`;
	console.log(query);
	return await eval(query);
};
