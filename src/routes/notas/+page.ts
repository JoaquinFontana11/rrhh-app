import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';

// usamos CSR para poder usar el localStorage
export const ssr = false;

export const load: PageLoad<{
	data: PostgrestResponse<any>;
}> = async () => {
	const notas = await supabase.from('notas').select('*');

	return {
		data: notas.data
	};
};
