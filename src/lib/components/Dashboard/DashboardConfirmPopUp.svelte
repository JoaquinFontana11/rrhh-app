<script lang="ts">
	import { Icon, X, ExclamationCircle, Check } from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();
</script>

<div
	class={`w-[34rem] h-auto bg-white border border-white dark:border-stone-500 dark:bg-stone-800 rounded-md shadow-xl p-2 flex flex-col gap-2 dark:border-2`}
>
	<div class="flex items-center justify-center flex-col dark:text-stone-100">
		<span class="font-bold text-lg ">¿Esta seguro que quiere eliminar esta nota?</span>
		<span>Se eliminara permanentemente...</span>
	</div>
	<hr class=" my-1 h-0.5 bg-stone-300 dark:bg-stone-900" />
	<div class="flex justify-end items-center gap-6">
		<button
			class="flex flex-row border p-2 rounded-lg bg-DPMA-Error hover:bg-dark-Error disabled:dark:bg-stone-600 dark:border-stone-500"
			on:click={() => {
				dispatcher('confirm', true);
			}}
		>
			<Icon src={Check} class="w-6 h-6 dark:text-stone-100 " />
			<span class="dark:text-stone-100">Aceptar</span>
		</button>
		<button
			class="flex flex-row border p-2 rounded-lg bg-green-500 hover:bg-green-600 dark:hover:bg-green-700 dark:bg-green-800 disabled:dark:bg-stone-600 dark:border-stone-500"
			on:click={() => {
				dispatcher('confirm', false);
			}}
		>
			<Icon src={X} class="w-6 h-6  dark:text-stone-100" />
			<span class="dark:text-stone-100">Cancelar</span>
		</button>
	</div>
</div>
