import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Nota, Usuario } from '$lib/types';
import notasStore from '$lib/stores/notasStore';

// usamos CSR para poder usar el localStorage.
export const ssr = false;

export const load: PageLoad = async () => {
	const response = await supabase.auth.update;
	notasStore.update((n) => []);

	const res: PostgrestResponse<Nota> = await supabase.from('notas').select('*');
	const usuarios: PostgrestResponse<Usuario> = await supabase.from('usuarios').select('*');
	return {
		data: res.data,
		allUsers: usuarios.data,
		reload: reload
	};
};

const reload = async () => {
	const res: PostgrestResponse<Nota> = await supabase.from('notas').select('*');

	return res.data;
};
