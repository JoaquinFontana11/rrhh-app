import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import notasStore from '$lib/stores/notasStore';

export const load: PageLoad = async ({ url }) => {
	const { data }: { data: any } = await supabase
		.from('notas')
		.select('*')
		.ilike('modulo', `%${url.pathname}%`);
	notasStore.update((n) => data);

	const { data: agentes } = await supabase.from('agente').select('*');

	return {
		agentes
	};
};
