import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageLoad = async () => {
	const { data: agentes } = await supabase.from('agente').select('*');

	return {
		agentes
	};
};
