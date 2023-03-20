<script lang="ts">
	import { fly } from 'svelte/transition';
	import HeaderNotifySmallCard from './HeaderNotifySmallCard.svelte';

	import notasStore from '$lib/stores/notasStore';
	import type { Nota } from '$lib/types';

	import DashboardBigCardNote from '../Dashboard/Notes/DashboardBigCardNote.svelte';

	let notas: Nota[] = [];
	notasStore.subscribe((val: Nota[]) => {
		notas = val;
	});

	let showBigNote: boolean = false;
	let bigNote: Nota;

	const stopPropagation = (e: Event) => {
		e.stopPropagation();
	};
	const setNote = (e: CustomEvent) => {
		bigNote = e.detail.note;
		showBigNote = true;
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
				note={bigNote}
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
