<script lang="ts">
	import { flip } from 'svelte/animate';
	import DashboardNote from './DashboardNote.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Nota, Usuario } from '$lib/types';
	import { dndzone } from 'svelte-dnd-action';
	import { supabase } from '$lib/supabaseClient';
	import { watchResize } from 'svelte-watch-resize';

	const dispatcher = createEventDispatcher();

	export let notes: Nota[];
	export let allUsers: Usuario[];
	let blur = false;

	let notesObj: { [key: string]: any } = {
		ok: notes.filter((note) => note.nivel == 'ok'),
		warn: notes.filter((note) => note.nivel == 'warn'),
		alert: notes.filter((note) => note.nivel == 'alert')
	};

	const clearNotes = (e: CustomEvent) => {
		notes = notes.filter((note) => note.id !== e.detail.id);
		dispatcher('delete-note', { id: e.detail.id });
	};

	const flipDurationMs = 200;
	const type = 'light';

	const handleSort = async (e: CustomEvent) => {
		const target = e.target as HTMLDivElement;
		const type: string = target.id;
		notesObj[type] = e.detail.items;
	};
	const handleSortFinalize = async (e: CustomEvent) => {
		const target = e.target as HTMLDivElement;
		const type: string = target.id;
		notesObj[type] = e.detail.items;
		const arrayIds: Array<number> = e.detail.items.map((note: Nota) => note.id);

		await supabase.from('notas').update({ nivel: type }).in('id', arrayIds).select();
		dispatcher('refresh', {});
	};
	$: notesObj = {
		ok: notes.filter((note) => note.nivel == 'ok'),
		warn: notes.filter((note) => note.nivel == 'warn'),
		alert: notes.filter((note) => note.nivel == 'alert')
	};
</script>

<div class="flex h-full w-full">
	<div
		class="pt-10 bg-lime-500/20 dark:bg-stone-900 dark:border-2 dark:border-DPMA-Succes h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
		use:dndzone={{ items: notesObj.ok, flipDurationMs, type, dragDisabled: blur }}
		on:consider={handleSort}
		on:finalize={handleSortFinalize}
		id="ok"
	>
		{#each notesObj.ok as note (note.id)}
			<div animate:flip={{ duration: flipDurationMs }} class="w-full flex justify-center">
				<DashboardNote
					{note}
					{allUsers}
					on:delete-note={clearNotes}
					on:set-blur={() => {
						blur = !blur;
						dispatcher('refresh', {});
					}}
					on:stopLong={() => {
						dispatcher('stopLong', {});
					}}
					on:initLong={() => {
						dispatcher('initLong', {});
					}}
				/>
			</div>
		{/each}
	</div>
	<div
		class="pt-10 bg-yellow-500/20 dark:bg-stone-900 dark:border-2 dark:border-DPMA-Yellow h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
		use:dndzone={{ items: notesObj.warn, flipDurationMs, type, dragDisabled: blur }}
		on:consider={handleSort}
		on:finalize={handleSortFinalize}
		id="warn"
	>
		{#each notesObj.warn as note (note.id)}
			<div animate:flip={{ duration: flipDurationMs }} class="w-full flex justify-center">
				<DashboardNote
					{note}
					{allUsers}
					on:delete-note={clearNotes}
					on:set-blur={() => {
						blur = !blur;
						dispatcher('refresh', {});
					}}
					on:stopLong={() => {
						dispatcher('stopLong', {});
					}}
					on:initLong={() => {
						dispatcher('initLong', {});
					}}
				/>
			</div>
		{/each}
	</div>
	<div
		class="pt-10 bg-DPMA-Rose/20 dark:bg-stone-900 dark:border-2 dark:border-DPMA-Rose h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
		use:dndzone={{ items: notesObj.alert, flipDurationMs, type, dragDisabled: blur }}
		on:consider={handleSort}
		on:finalize={handleSortFinalize}
		id="alert"
	>
		{#each notesObj.alert as note (note.id)}
			<div animate:flip={{ duration: flipDurationMs }} class="w-full flex justify-center">
				<DashboardNote
					{note}
					{allUsers}
					on:delete-note={clearNotes}
					on:set-blur={() => {
						blur = !blur;
						dispatcher('refresh', {});
					}}
					on:stopLong={() => {
						dispatcher('stopLong', {});
					}}
					on:initLong={() => {
						dispatcher('initLong', {});
					}}
				/>
			</div>
		{/each}
	</div>
</div>
