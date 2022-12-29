import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageLoad = async () => {
	const agentes = await supabase.from('agente').select('*').range(0, 10);
	return {
		data: agentes.data
	};
};
