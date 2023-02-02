import '$lib/supabaseClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { session, supabaseClient } = await getSupabase(event);

	console.log('SESSION HOOK SERVER: ', session);

	event.locals.sb = supabaseClient;
	event.locals.session = session;

	if (!session && !event.url.toString().includes('login')) throw redirect(303, '/login');

	return resolve(event);
};
