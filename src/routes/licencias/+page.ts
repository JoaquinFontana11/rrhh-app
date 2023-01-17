import type { PageLoad } from './$types';
import { supabase, execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
import notasStore from '$lib/stores/notasStore';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
	const { data }: { data: any } = await supabase
		.from('notas')
		.select('*')
		.ilike('modulo', `%${url.pathname}%`);
	notasStore.update((n) => data);

	const { data: agentes } = await supabase.from('agente').select('*');
	//const { data: licencias } = await supabase.from('licencia').select('*');

	const licencias = await reloadData(0, { field: 'fechaInicio', direction: true }, [], 10);
	const { data: fields } = await supabase
		.from('licencia')
		.select('agente(nombreCompleto), fechaInicio, fechaFin, observaciones, autorizadoSiape')
		.range(0, 1);

	return {
		licencias: licencias.data,
		agentes,
		reloadData,
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
