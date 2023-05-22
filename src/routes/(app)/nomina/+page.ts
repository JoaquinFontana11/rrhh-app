import type { PageLoad } from './$types';
import { supabase, execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';
import notasStore from '$lib/stores/notasStore';
import type { Filter, Nota, Order, FlatAgenteSupabase } from '$lib/types';

type CustomPageLoad = PageLoad<{
	data: FlatAgenteSupabase[];
	lastPage: number;
	reloadData: Function;
	calcLastPage: Function;
	fields: any[] | null | undefined;
}>;

// usamos CSR para poder usar el localStorage
export const ssr = false;

export const load: CustomPageLoad = async ({ url }) => {
	// cargamos las notas
	const resSupabaseNotas: PostgrestResponse<Nota> = await supabase
		.from('notas')
		.select('*')
		.ilike('modulo', `%${url.pathname}%`);

	const notas = resSupabaseNotas.data as any;
	if (resSupabaseNotas.data) notasStore.update((n) => notas);

	// cargamos el orden de la consulta
	const order: Order = JSON.parse(localStorage.getItem('order') as string) || {
		field: 'DNI',
		direction: true
	};

	// cargamos los filtros de la consulta
	const filter: Filter[] = JSON.parse(localStorage.getItem('filter') as string) || [];

	// contamos la cantidad maxima de registros para la paginacion
	let { count: lastPage } = await supabase.from('agente').select('*', { count: 'exact' });

	// cargamos los agentes iniciales
	const resAgentesSupabase = await reloadData(0, order, filter, 10);
	const agentes: FlatAgenteSupabase[] = resAgentesSupabase.data;

	// cargamos todos los campos para filtrar
	let resFieldsSupabase: PostgrestResponse<any> = await supabase
		.from('agente')
		.select(
			'*,datosRecorrido (tipoContratacion,PP(*),PTT(*),CLS(*)), datosAcademicos (*), datosSalud (*),superiorDirecto(*),equipo(*),direccion(*)'
		)
		.range(0, 1);

	const fields = flatSupabaseResponse(resFieldsSupabase.data);
	console.log(Object.entries(fields[0]).map((entries) => entries[0]));
	return {
		data: agentes,
		lastPage: Math.trunc((lastPage as number) / 10),
		reloadData: reloadData,
		calcLastPage,
		fields: Object.entries(fields[0]).map((entries) => entries[0])
	};
};

const reloadData = async (
	page: number,
	order = { field: 'DNI', direction: true },
	filters: any[],
	cantPage: number
) => {
	/* 	const val = await supabase
		.from('agente')
		.select(
			'*,datosRecorrido (tipoContratacion,PP (*),PTT (*),CLS (*)), datosAcademicos (*), datosSalud (*),superiorDirecto(*),equipo(*),direccion(*)'
		); */
	//console.log(val);
	const resSupabase = await execSupabaseQuery(
		`supabase.from('agente').select('*,datosRecorrido (tipoContratacion,PP (*),PTT (*),CLS (*)), datosAcademicos (*), datosSalud (*),superiorDirecto(*),equipo(*),direccion(*)')`,
		page,
		filters,
		order,
		cantPage
	);
	console.log(resSupabase);
	resSupabase.data = flatSupabaseResponse(resSupabase.data);
	//console.log(resSupabase);
	return resSupabase;
};

const calcLastPage = async (order = { field: 'DNI', direction: true }, filters: any[]) => {
	let querySupabase = `supabase.from('agente').select('*', {count: 'exact'})`;
	filters.map((f) => {
		querySupabase += `.${f.filter}('${f.field}', '${f.value}')`;
	});
	querySupabase += `.order('${order.field}', {ascending: ${order.direction}})`;
	return await eval(querySupabase);
};
