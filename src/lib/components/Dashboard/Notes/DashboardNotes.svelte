<script lang="ts">
	import { flip } from 'svelte/animate';
	import DashboardNote from './DashboardNote.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Nota } from '$lib/types';

	const dispatcher = createEventDispatcher();

	export let notes: Nota[];

	const clearNotes = (e: CustomEvent) => {
		notes = notes.filter((note) => note.id !== e.detail.id);
		dispatcher('delete-note', { id: e.detail.id });
	};
</script>

<div class="flex h-full w-full">
	<div
		class="pt-10 bg-lime-500/20 dark:bg-stone-900   h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
	>
		{#each notes.filter((note) => note.nivel == 'ok') as note (note.id)}
			<div animate:flip={{ duration: 300 }} class="w-full flex justify-center">
				<DashboardNote {note} on:delete-note={clearNotes} />
			</div>
		{/each}
	</div>
	<div
		class="pt-10 bg-yellow-500/20 dark:bg-stone-900 dark:border-l dark:border-r dark:border-stone-800   h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
	>
		{#each notes.filter((note) => note.nivel == 'warn') as note (note.id)}
			<div animate:flip={{ duration: 300 }} class="w-full flex justify-center">
				<DashboardNote {note} on:delete-note={clearNotes} />
			</div>
		{/each}
	</div>
	<div
		class="pt-10 bg-rose-500/20 dark:bg-stone-900   h-full w-full flex flex-col gap-5 p-2 justify-start items-center overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
	>
		{#each notes.filter((note) => note.nivel == 'alert') as note (note.id)}
			<div animate:flip={{ duration: 300 }} class="w-full flex justify-center">
				<DashboardNote {note} on:delete-note={clearNotes} />
			</div>
		{/each}
	</div>
</div>
