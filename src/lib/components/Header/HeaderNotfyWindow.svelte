<script lang="ts">
	import { fly } from 'svelte/transition';
	import HeaderNotifySmallCard from './HeaderNotifySmallCard.svelte';
	import { supabase } from '$lib/supabaseClient';

	import notasStore from '$lib/stores/notasStore';
	import type { Nota, Usuario } from '$lib/types';

	import DashboardBigCardNote from '../Dashboard/Notes/DashboardBigCardNote.svelte';

	let notas: Nota[] = [];
	notasStore.subscribe((val: Nota[]) => {
		notas = val;
	});

	let showBigNote: boolean = false;
	let bigNote: Nota;
	let usuarios: Usuario[] | undefined = [];

	const stopPropagation = (e: Event) => {
		e.stopPropagation();
	};
	const setNote = async (e: CustomEvent) => {
		await getTaggedUsers(e.detail.note.id);
		console.log(usuarios);
		bigNote = e.detail.note;
		showBigNote = true;
	};

	const setData = (data: { usuario: Usuario }[] | null) => {
		usuarios = [];
		console.log(data);
		return data?.map((user) => {
			return user.usuario;
		});
	};

	const getTaggedUsers = async (note_id: number) => {
		usuarios = setData(
			(await supabase.from('usuariosEtiquetados').select('usuario(*)').eq('nota', note_id)).data
		);
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
				note={bigNote}
				bind:usuarios
				modify={false}
				on:close-note={() => {
					showBigNote = false;
				}}
			/>
		</div>
	</div>
{/if}
<div
	class="bg-white drop-shadow-lg absolute top-12 right-8 text-stone-300 w-80 z-50 h-40 rounded-md  overflow-auto scrollbar-thin scrollbar-thumb-stone-400 scrollbar-w-1 scrollbar-thumb-rounded-md dark:bg-stone-800"
	transition:fly
>
	<div class="flex flex-col justify-center gap-2 mx-2 pt-2">
		{#each notas as nota}
			<HeaderNotifySmallCard {nota} on:show-big-note={setNote} />
		{/each}
	</div>
</div>
