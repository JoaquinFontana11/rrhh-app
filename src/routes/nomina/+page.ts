import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';
import notasStore from '$lib/stores/notasStore';
// usamos CSR para poder usar el localStorage
export const ssr = false;

export const load: PageLoad<{
	data: PostgrestResponse<any>;
	lastPage: number;
	reloadData: Function;
	calcLastPage: Function;
	fields: any[] | null | undefined;
}> = async ({ url }) => {
	const { data }: { data: any } = await supabase
		.from('notas')
		.select('*')
		.ilike('modulo', `%${url.pathname}%`);
	notasStore.update((n) => data);

	const order = JSON.parse(localStorage.getItem('order') as string) || {
		field: 'DNI',
		direction: true
	};
	const filter = JSON.parse(localStorage.getItem('filter') as string) || [];

	// contamos la cantidad maxima de registros para la paginacion
	let { count: lastPage } = await supabase.from('agente').select('*', { count: 'exact' });
	// cargamos los agentes iniciales
	const agentes = await reloadData(0, order, filter);
	// cargamos todos los campos para filtrar
	let { data: fields }: { data: any } = await supabase
		.from('agente')
		.select(
			'*, datosRecorrido (*), datosAcademicos (*), datosSalud (*), equipo (*),  direccion (*), superiorDirecto (*)'
		)
		.range(0, 1);

	fields = flatSupabaseResponse(fields);
	console.log();
	return {
		data: agentes.data,
		lastPage: Math.trunc((lastPage as number) / 10),
		reloadData: reloadData,
		calcLastPage,
		fields: Object.entries(fields[0]).map((entries) => entries[0])
	};
};

const reloadData = async (
	page: number,
	order = { field: 'DNI', direction: true },
	filters: any[]
) => {
	let querySupabase = `supabase.from('agente').select('*, datosRecorrido (*), datosAcademicos (*), datosSalud (*), equipo (*),  direccion (*), superiorDirecto (*)').range(${
		page * 10
	}, ${page * 10 + 9})`;
	filters.map((f) => {
		querySupabase += `.${f.filter}('${f.field}', '${
			f.filter == 'ilike' ? `%${f.value}%` : f.value
		}')`;
	});
	querySupabase += `.order('${order.field}', {ascending: ${order.direction}})`;

	const resSupabase = await eval(querySupabase);
	/*
	resSupabase.data = resSupabase.data.map((data: any) => {
		let flattedArr: any = [];

		// repasamos las claves y si hay un objeto lo llevamos un nivel por encima
		for (let key in data) {
			if (typeof data[key] !== 'object' || data[key] == null) {
				flattedArr.push([key, data[key]]);
			} else if (key == 'superiorDirecto' || key == 'equipo' || key == 'direccion') {
				flattedArr.push([key, data[key].id]);
			} else {
				for (let subKey in data[key]) {
					flattedArr.push([subKey, data[key][subKey]]);
				}
			}
		}
		return Object.fromEntries(flattedArr);
	});
	*/
	resSupabase.data = flatSupabaseResponse(resSupabase.data);
	return resSupabase;
};

const calcLastPage = async (order = { field: 'DNI', direction: true }, filters: any[]) => {
	let querySupabase = `supabase.from('agente').select('*', {count: 'exact'})`;
	filters.map((f) => {
		querySupabase += `.${f.filter}('${f.field}', '${f.value}')`;
	});
	querySupabase += `.order('${order.field}', {ascending: ${order.direction}})`;
	return await eval(querySupabase);
};

const flatSupabaseResponse = (resSupabaseData: any) =>
	resSupabaseData.map((data: any) => {
		let flattedArr: any = [];

		// repasamos las claves y si hay un objeto lo llevamos un nivel por encima
		for (let key in data) {
			if (typeof data[key] !== 'object' || data[key] == null) {
				flattedArr.push([key, data[key]]);
			} else if (key == 'superiorDirecto' || key == 'equipo' || key == 'direccion') {
				flattedArr.push([key, data[key].id]);
			} else {
				for (let subKey in data[key]) {
					flattedArr.push([subKey, data[key][subKey]]);
				}
			}
		}
		return Object.fromEntries(flattedArr);
	});
