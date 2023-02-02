import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';

type LicenciaShort = {
	fechaInicio: string;
	fechaFin: string;
	tipo: string;
};

export const load: PageLoad<{ data: LicenciaShort[] }> = async () => {
	const resSupabaseLicencias: PostgrestResponse<LicenciaShort> = await supabase
		.from('licencia')
		.select('fechaInicio, fechaFin, tipo');

	let licencias: LicenciaShort[] = [];
	if (resSupabaseLicencias.data) licencias = resSupabaseLicencias.data;

	return {
		data: licencias
	};
};
