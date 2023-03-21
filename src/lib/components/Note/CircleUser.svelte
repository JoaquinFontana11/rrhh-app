<script lang="ts">
	import type { Usuario } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let user: Usuario;
	const dispatcher = createEventDispatcher();
	let active: boolean = false;
	let color = `bg-Pastel-${user.color + ''}`;
</script>

<div
	on:mouseenter={() => {
		active = true;
	}}
	on:mouseleave={() => {
		active = false;
	}}
>
	<button
		class="w-4 h-4 rounded-full bg-red-600 text-xs flex items-center justify-center border-black border-2 absolute"
		on:click={() => {
			console.log(user);
			dispatcher('delete-user', user);
		}}
	>
		x
	</button>
	<div
		class={'w-10 h-10 rounded-full flex items-center justify-center border border-black cursor-default ' +
			color}
	>
		{user.nombre[0].toUpperCase()}{user.apellido[0].toUpperCase()}
	</div>
	{#if active}
		<p
			class="absolute translate-y-1/4 bg-stone-900 text-stone-300 p-1 rounded-md text-[12px] w-max dark:bg-black before:content-[''] before:w-0 before:h-0 before:absolute before:ml-[-14px] before:rotate-[360deg] before:border before:border-b-[6px] before:border-b-stone-900 before:border-r-[5px] before:border-r-transparent before:border-l-[5px] before:border-l-transparent before:border-t-transparent before:dark:border-b-black before:bottom-[85%] before:-translate-y-1/3 before:left-[20%] before:translate-x-2/3"
			transition:fade={{ duration: 50 }}
		>
			{user.nombre}
			{user.apellido}
		</p>
	{/if}
</div>
