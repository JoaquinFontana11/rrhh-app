<script>
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar/Sidebar.svelte';
	import Header from '$lib/components/Header/Header.svelte';
</script>

<main class="flex bg-white w-screen h-screen dark:bg-stone-900">
	<Sidebar />
	<div class="grow">
		<Header />
		<slot />
	</div>
</main>
