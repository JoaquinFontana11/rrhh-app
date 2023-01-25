import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Nota } from '$lib/types';

// usamos CSR para poder usar el localStorage
export const ssr = false;

export const load: PageLoad = async () => {
	const res: PostgrestResponse<Nota> = await supabase.from('notas').select('*');

	return {
		data: res.data,
		reload: reload
	};
};

const reload = async () => {
	const res: PostgrestResponse<Nota> = await supabase.from('notas').select('*');

	return res.data;
};
