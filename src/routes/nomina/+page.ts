import type { PageLoad } from './$types';
import { supabase, execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';
import notasStore from '$lib/stores/notasStore';

// usamos CSR para poder usar el localStorage
export const ssr = false;

export const load: PageLoad<{
	data: PostgrestResponse<any>;
	lastPage: number;
	reloadData: Function;
	calcLastPage: Function;
	fields: any[] | null | undefined;
}> = async ({ url }) => {
	const { data }: { data: any } = await supabase
		.from('notas')
		.select('*')
		.ilike('modulo', `%${url.pathname}%`);
	notasStore.update((n) => data);

	const order = JSON.parse(localStorage.getItem('order') as string) || {
		field: 'DNI',
		direction: true
	};
	const filter = JSON.parse(localStorage.getItem('filter') as string) || [];
	// contamos la cantidad maxima de registros para la paginacion
	let { count: lastPage } = await supabase.from('agente').select('*', { count: 'exact' });

	// cargamos los agentes iniciales
	const agentes = await reloadData(0, order, filter, 10);
	// cargamos todos los campos para filtrar
	let { data: fields }: { data: any } = await supabase
		.from('agente')
		.select(
			'*, datosRecorrido (*), datosAcademicos (*), datosSalud (*), equipo (*),  direccion (*), superiorDirecto (*)'
		)
		.range(0, 1);

	fields = flatSupabaseResponse(fields);
	return {
		data: agentes.data,
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
	const resSupabase = await execSupabaseQuery(
		`supabase.from('agente').select('*, datosRecorrido (*), datosAcademicos (*), datosSalud (*), equipo (*),  direccion (*), superiorDirecto (*)')`,
		page,
		filters,
		order,
		cantPage
	);

	resSupabase.data = flatSupabaseResponse(resSupabase.data);
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
