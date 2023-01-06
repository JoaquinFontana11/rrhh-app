import { supabase } from '$lib/supabaseClient';

export const load = async ({ url }) => {
	const { data } = await supabase.from('notas').select('*').ilike('modulo', `%${url.pathname}%`);

	return {
		data
	};
};
