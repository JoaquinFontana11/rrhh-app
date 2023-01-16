import { createClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export const supabase = createClient(
	PUBLIC_SUPABASE_URL as string,
	PUBLIC_SUPABASE_ANON_KEY as string
);

export const execSupabaseQuery = async (query: string, page: any, filters: any, order: any) => {
	// agregamos la paginacion a la query original
	let querySupabase = query;
	if (page) querySupabase += `.range(${page * 10},${page * 10 + 9})`;

	// agregamos los filtros
	filters.map((f) => {
		querySupabase += `.${f.filter}('${f.field}', '${
			f.filter == 'ilike' ? `%${f.value}%` : f.value
		}')`;
	});

	// agegamos el order
	querySupabase += `.order('${order.field}', {ascending: ${order.direction}})`;

	// ejecutamos la query y la aplanamos
	const res = await eval(querySupabase);

	return res;
};

export const flatSupabaseResponse = (resSupabaseData: any) =>
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
