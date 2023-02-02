import type { PageLoad } from './$types';
import { supabase, execSupabaseQuery, flatSupabaseResponse } from '$lib/supabaseClient';
import notasStore from '$lib/stores/notasStore';
import type { PostgrestResponse } from '@supabase/postgrest-js';
import type { AgenteSupabase, Nota, FlatLicenciaSupabase, Filter } from '$lib/types';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
	// cargamos las notas
	const resSupabaseNotas: PostgrestResponse<Nota> = await supabase
		.from('notas')
		.select('*')
		.ilike('modulo', `%${url.pathname}%`);

	const notas = resSupabaseNotas.data as any;
	if (resSupabaseNotas.data) notasStore.update((n) => notas);

	// cargamos los agentes
	const resSupabaseAgentes: PostgrestResponse<AgenteSupabase> = await supabase
		.from('agente')
		.select('*');
	const agentes = resSupabaseAgentes.data;

	// contamos la cantidad maxima de licencias (inicialmente ausentes con aviso)
	const resSupabaseCountLicencias: PostgrestResponse<any> = await supabase
		.from('licencia')
		.select('*', { count: 'exact' })
		.eq('tipo', 'ausente');
	const lastPage = resSupabaseCountLicencias.count;

	// cargamos todas las licencias
	const resSupabaseLicencias: any = await reloadData(
		0,
		{ field: 'fechaInicio', direction: true },
		[],
		10
	);
	const licencias: FlatLicenciaSupabase[] = resSupabaseLicencias.data;

	// cargamos los campos para filtrar
	const resSupabaseFields: PostgrestResponse<any> = await supabase
		.from('licencia')
		.select('id, fechaInicio, fechaFin, observaciones, autorizadoSiape')
		.range(0, 1);
	const fields = flatSupabaseResponse(resSupabaseFields.data);

	return {
		licencias: licencias,
		agentes,
		lastPage: Math.trunc((lastPage as number) / 10),
		reloadData,
		calcLastPage,
		manageFilters,
		fields: [
			...Object.entries(fields[0]).map((entries) => entries[0]),
			'equipo',
			'direccion',
			'nombreCompleto'
		]
	};
};

const reloadData = async (
	page: number,
	order = { field: 'fechaInicio', direction: true },
	filters: any[],
	cantPage: number,
	tipo: string = 'ausente'
) => {
	const query = `supabase.from('licencia').select('id, fechaInicio, fechaFin, tipo, observaciones, autorizadoSiape, agente(nombreCompleto,direccion(id,acronimo),equipo(id,equipo))${
		tipo == 'academica'
			? ', datosAcademicos(ultimaMateria)'
			: tipo == 'salud'
			? ', datosSalud(concepto)'
			: tipo == 'teletrabajo'
			? ', datosTeletrabajo(mailAutorizado,comunicacionInicio,comunicoInicioA,comunicacionFin,comunicoFinA,conectadoATeams)'
			: tipo == 'vacaciones'
			? ', datosVacaciones(periodo)'
			: ''
	}')`;

	filters = await manageFilters(filters);

	const resSupabase = await execSupabaseQuery(query, page, filters, order, cantPage);
	resSupabase.data = flatSupabaseResponse(resSupabase.data);

	return resSupabase;
};

const calcLastPage = async (
	order = { field: 'fechaInicio', direction: true },
	filters: any[],
	tipo: string = 'ausente'
) => {
	let query = `supabase.from('licencia').select('id, fechaInicio, fechaFin, tipo, observaciones, autorizadoSiape, agente(nombreCompleto,direccion(id,acronimo),equipo(id,equipo))${
		tipo == 'academica'
			? ', datosAcademicos(ultimaMateria)'
			: tipo == 'salud'
			? ', datosSalud(concepto)'
			: tipo == 'teletrabajo'
			? ', datosTeletrabajo(mailAutorizado,comunicacionInicio,comunicoInicioA,comunicacionFin,comunicoFinA,conectadoATeams)'
			: tipo == 'vacaciones'
			? ', datosVacaciones(periodo)'
			: ''
	}', {count: 'exact'})`;

	filters.map((f) => {
		query += `.${f.filter}('${f.field}', '${f.value}')`;
	});
	query += `.order('${order.field}', {ascending: ${order.direction}})`;

	const resSupabase = await eval(query);

	return resSupabase;
};

const manageFilters = async (filters: Filter[]) =>
	await Promise.all(
		filters.map(async (filter: Filter) =>
			filter.field === 'direccion' || filter.field === 'equipo' || filter.field === 'nombreCompleto'
				? await searchAgentes(filter)
				: filter
		)
	);

const searchAgentes = async (filter: Filter) => {
	let res: PostgrestResponse<any>;
	if (filter.field === 'nombreCompleto') {
		res = await supabase.from('agente').select('id').eq(filter.field, filter.value);
	} else {
		const column = filter.field === 'equipo' ? 'equipo' : 'acronimo';
		const id = await searchId(filter.field, column, filter.value);

		res = await supabase.from('agente').select('id').eq(filter.field, id);
	}

	const ids: any[] | undefined = res.data?.map((data) => data.id);

	return { field: 'agente', filter: 'in', value: ids };
};

const searchId = async (table: string, column: string, value: string | number | number[]) => {
	let res: PostgrestResponse<any> = await supabase.from(table).select('id').eq(column, value);
	if (!res.data) return;
	return res.data[0] ? res.data[0].id : -1;
};
