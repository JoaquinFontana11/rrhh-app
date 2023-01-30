import { createClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Filter } from './types';

export const supabase = createClient(
	PUBLIC_SUPABASE_URL as string,
	PUBLIC_SUPABASE_ANON_KEY as string
);

export const execSupabaseQuery = async (
	query: string,
	page: any,
	filters: any,
	order: any,
	cantPage: number = 10
) => {
	// agregamos la paginacion a la query original
	let querySupabase = query;
	if (page || page == 0)
		querySupabase += `.range(${page * cantPage},${page * cantPage + cantPage - 1})`;

	// agregamos los filtros
	filters.map((f: Filter) => {
		querySupabase += `.${f.filter}('${f.field}', '${
			f.filter == 'ilike' ? `%${f.value}%` : f.value
		}')`;
	});

	// agegamos el order
	querySupabase += `.order('${order.field}', {ascending: ${order.direction}})`;

	// ejecutamos la query y la aplanamos
	console.log(querySupabase);
	const res = await eval(querySupabase);
	console.log(res);

	return res;
};

export const flatSupabaseResponse = (resSupabaseData: any) =>
	resSupabaseData.map((data: any) => {
		let flattedArr: any = [];

		// repasamos las claves y si hay un objeto lo llevamos un nivel por encima
		for (let key in data) {
			if (typeof data[key] !== 'object' || data[key] == null) {
				flattedArr.push([key, data[key]]);
			} else if (key == 'superiorDirecto') {
				flattedArr.push([key, { id: data[key].id, value: data[key].nombreCompleto }]);
			} else if (key == 'equipo') {
				flattedArr.push([key, { id: data[key].id, value: data[key].equipo }]);
			} else if (key == 'direccion') {
				flattedArr.push([key, { id: data[key].id, value: data[key].acronimo }]);
			} else {
				for (let subKey in data[key]) {
					if (subKey === 'direccion') {
						data[key][subKey].value = data[key][subKey].acronimo;
					} else if (subKey === 'equipo') {
						data[key][subKey].value = data[key][subKey].equipo;
					}
					flattedArr.push([subKey, data[key][subKey]]);
				}
			}
		}
		return Object.fromEntries(flattedArr);
	});
