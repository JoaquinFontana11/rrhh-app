<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar/Sidebar.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<main
	class="flex bg-white w-screen h-screen max-w-screen max-h-screen dark:bg-stone-900 overflow-x-hidden"
>
	<Sidebar />
	<div class="w-full h-full">
		<slot />
	</div>
</main>
