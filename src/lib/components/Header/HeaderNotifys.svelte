<script lang="ts">
	import { Icon, Bell } from 'svelte-hero-icons';
	import HeaderNotfyWindow from './HeaderNotfyWindow.svelte';
	let show = false;
</script>

<div>
	<button
		on:click={() => {
			show = !show;
		}}
		class="w-10 h-10 rounded-lg  text-DPMA-Grey hover:bg-gray-200 hover:text-dark-Grey flex justify-center items-center m-1 mr-2 dark:text-dark-Rose dark:hover:bg-stone-800 dark:hover:text-light-Rose"
	>
		<Icon src={Bell} class="w-8 h-8 " />
	</button>
	{#if show}
		<HeaderNotfyWindow />
	{/if}
</div>
