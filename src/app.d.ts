// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { PostgrestResponse } from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session } from '@supabase/supabase-js';

declare namespace App {
	// interface Error {}
	interface Locals {
		sb: TypedSupabaseClient;
		session: Session | null;
	}
	interface PageData {}
	interface PageLoad {
		data: PostgrestResponse<any>;
	}
	// interface Platform {}
}

declare module 'svelte-spinner';
