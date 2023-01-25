<script lang="ts">
	import { flip } from 'svelte/animate';
	import DashboardNote from './DashboardNote.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Nota } from '$lib/types';
	import { dndzone } from 'svelte-dnd-action';
	import { supabase } from '$lib/supabaseClient';

	const dispatcher = createEventDispatcher();

	export let notes: Nota[];

	let okNotes = notes.filter((note) => note.nivel == 'ok');
	let warnNotes = notes.filter((note) => note.nivel == 'warn');
	let alertNotes = notes.filter((note) => note.nivel == 'alert');

	const clearNotes = (e: CustomEvent) => {
		notes = notes.filter((note) => note.id !== e.detail.id);
		dispatcher('delete-note', { id: e.detail.id });
	};

	const flipDurationMs = 200;
	const type = 'light';

	const okHandleSort = async (e: Event) => {
		console.log('OK: ', e.detail.items);
		okNotes = e.detail.items;

		const arrayIds: Array<number> = okNotes.map((note) => note.id);
		await supabase.from('notas').update({ nivel: 'ok' }).in('id', arrayIds);
		dispatcher('update-notes', {});
	};

	const warnHandleSort = async (e: Event) => {
		console.log('WARN: ', e.detail.items);
		warnNotes = e.detail.items;

		const arrayIds: Array<number> = warnNotes.map((note) => note.id);
		await supabase.from('notas').update({ nivel: 'warn' }).in('id', arrayIds);
		dispatcher('update-notes', {});
	};
	const alertHandleSort = async (e: Event) => {
		console.log('ALERT: ', e.detail.items);
		alertNotes = e.detail.items;

		const arrayIds: Array<number> = alertNotes.map((note) => note.id);
		await supabase.from('notas').update({ nivel: 'alert' }).in('id', arrayIds);
		dispatcher('update-notes', {});
	};
</script>

<div class="flex h-full w-full">
	<div
		class="pt-10 bg-lime-500/20 dark:bg-stone-900   h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
		use:dndzone={{ items: okNotes, flipDurationMs, type }}
		on:consider={okHandleSort}
		on:finalize={okHandleSort}
	>
		{#each okNotes as note (note.id)}
			<div animate:flip={{ duration: flipDurationMs }} class="w-full flex justify-center">
				<DashboardNote {note} on:delete-note={clearNotes} />
			</div>
		{/each}
	</div>
	<div
		class="pt-10 bg-yellow-500/20 dark:bg-stone-900 dark:border-l dark:border-r dark:border-stone-800   h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
		use:dndzone={{ items: warnNotes, flipDurationMs, type }}
		on:consider={warnHandleSort}
		on:finalize={warnHandleSort}
	>
		{#each warnNotes as note (note.id)}
			<div animate:flip={{ duration: flipDurationMs }} class="w-full flex justify-center">
				<DashboardNote {note} on:delete-note={clearNotes} />
			</div>
		{/each}
	</div>
	<div
		class="pt-10 bg-rose-500/20 dark:bg-stone-900   h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
		use:dndzone={{ items: alertNotes, flipDurationMs, type }}
		on:consider={alertHandleSort}
		on:finalize={alertHandleSort}
	>
		{#each alertNotes as note (note.id)}
			<div animate:flip={{ duration: flipDurationMs }} class="w-full flex justify-center">
				<DashboardNote {note} on:delete-note={clearNotes} />
			</div>
		{/each}
	</div>
</div>
