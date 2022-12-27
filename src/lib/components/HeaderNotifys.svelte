<script lang="ts">
	import { Icon, Bell } from 'svelte-hero-icons';
	let show = false;
</script>

<div>
	<button
		on:click={() => {
			show = !show;
		}}
		class="w-10 h-10 rounded-lg  text-stone-700 hover:bg-gray-200 hover:text-stone-900 flex justify-center items-center m-1 mr-2 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-300"
	>
		<Icon src={Bell} class="w-8 h-8 " />
	</button>
	{#if show}
		<p class="absolute top-10 right-5">contenido de las notificaciones</p>
	{/if}
</div>
