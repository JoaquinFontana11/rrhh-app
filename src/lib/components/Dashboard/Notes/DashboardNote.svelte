<script lang="ts">
	import {
		Icon,
		X,
		CheckCircle,
		Exclamation,
		ExclamationCircle,
		PencilAlt,
		Check
	} from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Nota } from '$lib/types';
	import Spinner from 'svelte-spinner';

	export let note: Nota;
	const dispatcher = createEventDispatcher();
	let showEdit = false;
	let loading = false;

	const setLimitText = () => {
		note.contenido = note.contenido.length < 18 ? note.contenido : note.contenido.substring(0, 18);
	};
</script>

<div
	class="w-2/3 h-auto bg-white border border-white dark:bg-stone-800 rounded-md shadow-xl p-5 flex justify-start items-center  gap-2 dark:border-stone-700 "
>
	<div
		class="w-8"
		class:icon-ok={note.nivel == 'ok'}
		class:icon-warn={note.nivel == 'warn'}
		class:icon-alert={note.nivel == 'alert'}
	>
		<Icon
			src={note.nivel == 'ok'
				? CheckCircle
				: note.nivel == 'warn'
				? Exclamation
				: ExclamationCircle}
			class="w-8 h-8 "
		/>
	</div>
	{#if showEdit}
		<textarea
			id="contenido"
			name="contenido"
			rows="1"
			bind:value={note.contenido}
			on:input={setLimitText}
			class="resize-none bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
		/>
		<button
			on:click={async () => {
				await supabase.from('notas').update({ contenido: note.contenido }).eq('id', note.id);
				showEdit = false;
				dispatcher('refresh', {});
			}}
			>{#if loading}
				<Spinner />
			{:else}
				<Icon src={Check} class="w-6 h-6 text-stone-400 hover:text-stone-600" />
			{/if}</button
		>
	{:else}
		<p class="grow dark:text-stone-100">
			{note.contenido}
		</p>
	{/if}
	<button
		on:click={() => {
			showEdit = true;
		}}
	>
		<Icon src={PencilAlt} class="w-6 h-6 text-stone-400 hover:text-stone-600" />
	</button>
	<button
		on:click={async () => {
			await supabase.from('notas').delete().eq('id', note.id);
			dispatcher('delete-note', { id: note.id });
		}}
	>
		<Icon src={X} class="w-6 h-6 text-stone-400 hover:text-stone-600" />
	</button>
</div>

<style lang="postcss">
	.icon-ok {
		@apply text-green-500;
	}
	.icon-warn {
		@apply text-yellow-500;
	}
	.icon-alert {
		@apply text-rose-500;
	}
</style>
