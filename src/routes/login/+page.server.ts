import type { Action, Actions } from './$types';
import { supabase } from '$lib/supabaseClient';
import { AuthApiError } from '@supabase/supabase-js';
import { redirect, fail } from '@sveltejs/kit';

const login: Action = async ({ cookies, request, locals }) => {
	const body = Object.fromEntries(await request.formData());

	const { data, error: err } = await locals.sb.auth.signInWithPassword({
		email: body.email as string,
		password: body.password as string
	});

	// para crear un usuario debemos hacerlo por codigo y despues confirmar el mail
	/* 
	let belen = await supabase.auth.signUp({
		email: 'belen.simonutti@gba.gob.ar',
		password: '123456'
	});
	console.log(belen); */

	if (err) {
		if (err instanceof AuthApiError && err.status == 400) {
			return fail(400, {
				error: 'invalid credentials'
			});
		}
		return fail(500, {
			error: 'server error, try again'
		});
	}

	throw redirect(303, '/');
};

export const actions: Actions = {
	login
};
