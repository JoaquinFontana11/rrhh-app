<script lang="ts">
	import { Logout, Icon, type IconSource } from 'svelte-hero-icons';
	import { supabase } from '$lib/supabaseClient';

	const logOut = () => {
		supabase.auth.signOut();
	};
</script>

<button
	class="w-10 h-10 pr-2 rounded-lg text-red-600 hover:text-red-400 flex justify-center items-center"
	on:click|preventDefault={logOut}
	on:keypress|preventDefault={logOut}
>
	<Icon src={Logout} class="w-8 h-8 rotate-180" />
</button>
