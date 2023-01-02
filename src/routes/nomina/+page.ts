import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageLoad = async () => {
	const { count: lastPage } = await supabase.from('agente').select('*', { count: 'exact' });

	const agentes = await supabase.from('agente').select('*').range(0, 9);
	return {
		data: agentes.data,
		lastPage: lastPage / 10 - 1,
		reloadData: async (page) =>
			await supabase
				.from('agente')
				.select('*')
				.range(page * 10, page * 10 + 9)
	};
};
