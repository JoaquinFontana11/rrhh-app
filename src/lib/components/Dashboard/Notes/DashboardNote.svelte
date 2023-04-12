<script lang="ts">
	import { Icon, X, CheckCircle, Exclamation, ExclamationCircle, Eye } from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Nota, Usuario } from '$lib/types';
	import DashboardBigCardNote from './DashboardBigCardNote.svelte';
	import { fly } from 'svelte/transition';
	import DashboardConfirmPopUp from '../DashboardConfirmPopUp.svelte';

	export let note: Nota;
	export let allUsers: Usuario[];
	let allTaggedUsers: Usuario[];
	const dispatcher = createEventDispatcher();
	let showBigNote: boolean = false;
	let showConfirmPopUp: boolean = false;
	let usuarios: Usuario[] | undefined = [];

	const setBlur = async () => {
		await getTaggedUsers(note.id);
		dispatcher('set-blur', {});
		showBigNote = !showBigNote;
	};

	const setData = (data: { usuario: Usuario }[] | null) => {
		usuarios = [];
		return data?.map((user) => {
			return user.usuario;
		});
	};

	const stopPropagation = (e: Event) => {
		e.stopPropagation();
	};
	const getTaggedUsers = async (note_id: number) => {
		usuarios = setData(
			(await supabase.from('usuariosEtiquetados').select('usuario(*)').eq('nota', note_id)).data
		);
		allTaggedUsers = allUsers.filter((user) => !usuarios?.some((user2) => user.id === user2.id));
	};

	const deleteNote = async (e: CustomEvent) => {
		if (e.detail) {
			await supabase.from('usuariosEtiquetados').delete().eq('nota', note.id);
			await supabase.from('notas').delete().eq('id', note.id);
			dispatcher('delete-note', { id: note.id });
		}
		showConfirmPopUp = false;
		dispatcher('set-blur', {});
	};
</script>

{#if showBigNote}
	<div
		class="fixed inset-0 flex items-center justify-center z-[100]"
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
				bind:usuarios
				bind:allUsers={allTaggedUsers}
				on:close-note={() => {
					showBigNote = false;
					dispatcher('set-blur', {});
				}}
				on:refresh-users={async () => {
					await getTaggedUsers(note.id);
				}}
				on:stopLong={() => {
					dispatcher('stopLong', {});
				}}
				on:initLong={() => {
					dispatcher('initLong', {});
				}}
			/>
		</div>
	</div>
{/if}
{#if showConfirmPopUp}
	<div
		class="fixed inset-0 flex items-center justify-center z-[100]"
		on:click={stopPropagation}
		on:keyup={stopPropagation}
	>
		<div
			class="fixed inset-0 bg-stone-900 dark:bg-stone-700 opacity-75 blur-lg"
			on:click={stopPropagation}
			on:keyup={stopPropagation}
		/>
		<div class="relative z-10 pl-14" transition:fly={{ duration: 150 }}>
			<DashboardConfirmPopUp on:confirm={deleteNote} />
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
	<p class="grow dark:text-stone-100 max-h-6 break-words truncate overflow-hidden">
		{note.titulo}
	</p>
	<button on:click={setBlur}>
		<Icon src={Eye} class="w-6 h-6 text-stone-400 hover:text-stone-600" />
	</button>
	<button
		on:click={() => {
			dispatcher('set-blur', {});
			showConfirmPopUp = true;
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
