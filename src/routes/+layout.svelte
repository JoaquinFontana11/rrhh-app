<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar/Sidebar.svelte';
</script>

<main
	class="flex bg-white w-screen h-screen max-w-screen max-h-screen dark:bg-stone-900 overflow-x-hidden"
>
	<Sidebar />
	<div class="flex flex-col ">
		<slot />
	</div>
</main>
