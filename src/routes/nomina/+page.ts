import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

// usamos CSR para poder usar el localStorage
export const ssr = false;

export const load: PageLoad = async () => {
	const order = JSON.parse(localStorage.getItem('order')) || { field: 'DNI', direction: true };
	const filter = JSON.parse(localStorage.getItem('filter')) || [];

	//contamos la cantidad maxima de registros para la paginacion
	let { count: lastPage } = await supabase.from('agente').select('*', { count: 'exact' });
	// modificamos la funcin de supabase para aplicar los filtros
	const agentes = await reloadData(0, order, filter);

	return {
		data: agentes.data,
		lastPage: Math.trunc(lastPage / 10),
		reloadData: reloadData,
		calcLastPage,
		fields: (await supabase.from('agente').select('*').range(0, 1)).data[0]
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
