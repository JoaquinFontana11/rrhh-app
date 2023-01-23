<script lang="ts">
	import { fly } from 'svelte/transition';
	import HeaderNotifySmallCard from './HeaderNotifySmallCard.svelte';

	import notasStore from '$lib/stores/notasStore';
	import type { Nota } from '$lib/types';

	let notas: Nota[] = [];
	notasStore.subscribe((val: Nota[]) => {
		notas = val;
	});
</script>

<!-- <div
	class=" content-[''] w-0 h-0 absolute ml-[2px] mt-[-10px] rotate-[20deg] border border-b-[20px] border-b-stone-900 border-r-[12px] border-r-transparent border-l-[12px] border-l-transparent border-t-transparent dark:border-b-black"
/> -->
<div
	class="bg-white drop-shadow-lg absolute top-12 right-8 text-stone-300 w-80 z-50 h-40 rounded-md  overflow-auto scrollbar-thin scrollbar-thumb-stone-400 scrollbar-w-1 scrollbar-thumb-rounded-md dark:bg-stone-800"
	transition:fly
>
	<div class="flex flex-col justify-center gap-2 mx-2 pt-2">
		{#each notas as nota}
			<HeaderNotifySmallCard info={nota.contenido} category={nota.nivel} />
		{/each}
	</div>
</div>
