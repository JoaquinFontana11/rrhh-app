import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

// usamos CSR para poder usar el localStorage
export const ssr = false;

export const load: PageLoad = async () => {
	const order = JSON.parse(localStorage.getItem('order')) || { field: 'DNI', direction: true };
	const { count: lastPage } = await supabase.from('agente').select('*', { count: 'exact' });
	const agentes = await supabase
		.from('agente')
		.select('*')
		.range(0, 9)
		.order(order.field, { ascending: order.direction });
	return {
		data: agentes.data,
		lastPage: lastPage / 10 - 1,
		reloadData: async (page, order = { field: 'DNI', direction: true }) =>
			await supabase
				.from('agente')
				.select('*')
				.range(page * 10, page * 10 + 9)
				.order(order.field, { ascending: order.direction })
	};
};
