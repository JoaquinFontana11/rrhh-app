import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';

// usamos CSR para poder usar el localStorage
export const ssr = false;

export const load: PageLoad<{
	data: PostgrestResponse<any>;
	lastPage: number;
	reloadData: Function;
	calcLastPage: Function;
	fields: any[] | null | undefined;
}> = async () => {
	const order = JSON.parse(localStorage.getItem('order') as string) || {
		field: 'DNI',
		direction: true
	};
	const filter = JSON.parse(localStorage.getItem('filter') as string) || [];

	// contamos la cantidad maxima de registros para la paginacion
	let { count: lastPage } = await supabase.from('agente').select('*', { count: 'exact' });
	// cargamos los agentes iniciales
	const agentes = await reloadData(0, order, filter);
	// cargamos todos los campos para filtrar
	let { data: fields }: { data: any } = await supabase.from('agente').select('*').range(0, 1);
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
	filters: any[]
) => {
	let querySupabase = `supabase.from('agente').select('*').range(${page * 10}, ${page * 10 + 9})`;
	filters.map((f) => {
		querySupabase += `.${f.filter}('${f.field}', '${f.value}')`;
	});
	querySupabase += `.order('${order.field}', {ascending: ${order.direction}})`;
	return await eval(querySupabase);
};

const calcLastPage = async (order = { field: 'DNI', direction: true }, filters: any[]) => {
	let querySupabase = `supabase.from('agente').select('*', {count: 'exact'})`;
	filters.map((f) => {
		querySupabase += `.${f.filter}('${f.field}', '${f.value}')`;
	});
	querySupabase += `.order('${order.field}', {ascending: ${order.direction}})`;
	return await eval(querySupabase);
};
