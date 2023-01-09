<script lang="ts">
	import HeaderNotifys from './HeaderNotifys.svelte';

	const urlPath = location.pathname;
</script>

<header
	class="bg-white border-b border-gray-200 w-full flex justify-end items-center h-14 dark:bg-stone-900 dark:border-stone-800"
>
	{#if urlPath !== '/notas'}
		<HeaderNotifys />
	{/if}
</header>
