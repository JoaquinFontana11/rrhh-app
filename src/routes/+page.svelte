<script lang="ts">
	import type { PageData } from './$types';
	import { supabase } from '$lib/supabaseClient';

	export let data: PageData;
	let files: FileList;
	console.log(data);

	const fileSubmit = async () => {
		const file = files[0];
		const { data, error } = await supabase.storage
			.from('juanbucket')
			.upload('public/avatar.png', file);

		console.log(data, error);
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<form on:submit|preventDefault={fileSubmit}>
	<input type="file" bind:files />
	<input type="submit" value="subir a bucket" />
</form>
