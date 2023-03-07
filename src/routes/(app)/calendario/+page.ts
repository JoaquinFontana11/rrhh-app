import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';
import notasStore from '$lib/stores/notasStore';
import type { Nota } from '$lib/types';

type LicenciaShort = {
	fechaInicio: string;
	fechaFin: string;
	tipo: string;
	agente: {
		direccion: {
			acronimo: string;
			id: number;
		};
		equipo: {
			equipo: string;
			id: number;
		};
	};
};

export const load: PageLoad<{
	data: LicenciaShort[];
	direcciones: any;
	agentes: any;
	equipos: any;
}> = async ({ url }) => {
	const resSupabaseNotas: PostgrestResponse<Nota> = await supabase
		.from('notas')
		.select('*')
		.ilike('modulo', `%${url.pathname}%`);

	const notas = resSupabaseNotas.data as any;
	if (resSupabaseNotas.data) notasStore.update((n) => notas);
	const resSupabaseLicencias: PostgrestResponse<LicenciaShort> = await supabase
		.from('licencia')
		.select('fechaInicio, fechaFin, tipo, agente(direccion(acronimo, id), equipo(equipo, id))');
	const resSupabaseDirecciones: PostgrestResponse<any> = await supabase
		.from('direccion')
		.select('acronimo, id');
	const resSupabaseEquipos: PostgrestResponse<any> = await supabase
		.from('equipo')
		.select('equipo, id');
	const resSupabaseAgentes: PostgrestResponse<any> = await supabase
		.from('agente')
		.select('id, direccion, nombreCompleto, equipo');

	let licencias: LicenciaShort[] = [];
	let agentes = [];
	let direcciones = [];
	let equipos = [];

	if (resSupabaseLicencias.data) licencias = resSupabaseLicencias.data;
	if (resSupabaseDirecciones.data) direcciones = resSupabaseDirecciones.data;
	if (resSupabaseEquipos.data) equipos = resSupabaseEquipos.data;
	if (resSupabaseAgentes.data) agentes = resSupabaseAgentes.data;

	return {
		data: licencias,
		agentes,
		direcciones,
		equipos
	};
};
