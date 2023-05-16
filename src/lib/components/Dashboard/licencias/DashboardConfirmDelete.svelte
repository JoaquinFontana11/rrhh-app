<script lang="ts">
	import { Icon, X, ExclamationCircle, Check } from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();
	let reason: string = '';
</script>

<div
	class={`w-[34rem] h-auto bg-white border border-white dark:border-stone-500 dark:bg-stone-800 rounded-md shadow-xl p-2 flex flex-col gap-2 dark:border-2`}
>
	<div class="flex justify-end">
		<button
			on:click={() => {
				dispatcher('confirm', { status: false, reason: '' });
			}}
		>
			<Icon src={X} class="w-6 h-6  dark:text-stone-100" />
		</button>
	</div>
	<div class="flex items-center justify-center flex-col dark:text-stone-100">
		<span class="font-bold text-lg ">¿Esta seguro que quiere eliminar esta Licencia?</span>
	</div>
	<hr class=" my-1 h-0.5 bg-stone-300 dark:bg-stone-900" />
	<div class=" flex flex-col justify-end items-center gap-6">
		<label for="razonBorrado">Inserte la razon del Borrado antes de continuar</label>
		<input
			id="razonBorrado"
			type="text"
			name="razonBorrado"
			placeholder="Razon del borrado...."
			class="outline-none focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-800 focus:border-stone-800 block w-full p-2 dark:bg-stone-800 dark:text-stone-500 dark:focus:text-stone-200  dark:border-stone-600 dark:focus:border-stone-500"
			bind:value={reason}
		/>
		<button
			class="flex flex-row border p-2 rounded-lg bg-rose-600 hover:bg-rose-700  dark:hover:bg-rose-700 dark:bg-rose-800 disabled:dark:bg-stone-600 dark:border-stone-500"
			class:disabled={reason === ''}
			disabled={reason === ''}
			on:click={() => {
				dispatcher('confirm', { status: true, reason: reason });
			}}
		>
			<Icon src={Check} class="w-6 h-6 dark:text-stone-100 " />
			<span class="dark:text-stone-100">Aceptar</span>
		</button>
	</div>
</div>

<style lang="postcss">
	.disabled {
		@apply bg-green-300 cursor-not-allowed;
	}
</style>
