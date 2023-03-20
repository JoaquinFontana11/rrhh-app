<script lang="ts">
	import { Icon, X, CheckCircle, Exclamation, ExclamationCircle, Eye } from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Nota, Usuario } from '$lib/types';
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import DashboardBigCardNote from './DashboardBigCardNote.svelte';
	import { fly } from 'svelte/transition';
	import Spinner from 'svelte-spinner';

	export let note: Nota;
	const dispatcher = createEventDispatcher();
	let showBigNote = false;
	let loading = false;
	let usuarios: Usuario[] = [];

	const setLimitText = () => {
		note.contenido = note.contenido.length < 18 ? note.contenido : note.contenido.substring(0, 18);
	};
	const setBlur = async () => {
		await getTaggedUsers(note.id);
		dispatcher('set-blur', {});
		showBigNote = !showBigNote;
	};
	const stopPropagation = (e: Event) => {
		e.stopPropagation();
	};
	const getTaggedUsers = async (note_id: number) => {
		const users: PostgrestResponse<{ usuario: Usuario }> = await supabase
			.from('usuariosEtiquetados')
			.select('usuario(*)')
			.eq('nota', note_id);
		console.log(users.data);
		users.data?.map((user) => {
			usuarios.push(user.usuario);
		});
		console.log(usuarios);
	};
</script>

{#if showBigNote}
	<div
		class="fixed inset-0 flex items-center justify-center"
		on:click={stopPropagation}
		on:keyup={stopPropagation}
	>
		<div
			class="fixed inset-0 bg-stone-900 dark:bg-stone-700 opacity-75 blur-lg"
			on:click={stopPropagation}
			on:keyup={stopPropagation}
		/>
		<div class="relative z-10 pl-14" transition:fly={{ duration: 150 }}>
			<DashboardBigCardNote
				{note}
				{usuarios}
				on:close-note={() => {
					showBigNote = false;
					dispatcher('set-blur', {});
				}}
			/>
		</div>
	</div>
{/if}
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
	<p class="grow dark:text-stone-100">
		{note.titulo}
	</p>
	<button on:click={setBlur}>
		<Icon src={Eye} class="w-6 h-6 text-stone-400 hover:text-stone-600" />
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
