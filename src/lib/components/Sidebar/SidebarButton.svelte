<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Icon, type IconSource } from 'svelte-hero-icons';
	export let icon: IconSource;
	export let tooltip: String;
	let active = false;
</script>

<button
	class=" relative w-10 h-10 rounded-lg  text-stone-700 hover:bg-gray-200 hover:text-gray-900 flex justify-center items-center dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-300"
	on:mouseenter={() => {
		active = true;
	}}
	on:mouseleave={() => {
		active = false;
	}}
>
	<Icon src={icon} class="w-8 h-8" />
	{#if active}
		<p
			class="absolute top-1/2 -translate-y-1/2 left-2/3 translate-x-7 bg-stone-900 text-stone-300 p-1 rounded-md text-[12px] w-max dark:bg-black before:content-[''] before:w-0 before:h-0 before:absolute before:ml-[-14px] before:rotate-[270deg] before:border before:border-b-[12px] before:border-b-stone-900 before:border-r-[5px] before:border-r-transparent before:border-l-[5px] before:border-l-transparent before:border-t-transparent before:dark:border-b-black "
			transition:fade={{ duration: 50 }}
		>
			{tooltip}
		</p>
	{/if}
</button>
