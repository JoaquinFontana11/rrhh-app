<script lang="ts">
	import { fly } from 'svelte/transition';
	import { supabase } from '$lib/supabaseClient';
	import Spinner from 'svelte-spinner';
	import { createEventDispatcher } from 'svelte';
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import type { Nota } from '$lib/types';

	const dispatcher = createEventDispatcher();

	let nivel = 'ok';
	let contenido = '';
	let modulo = 'nomina';
	let loading = false;

	const createNote = async () => {
		if (loading) return;
		loading = true;
		const res: PostgrestResponse<Nota> = await supabase
			.from('notas')
			.insert({ modulo, nivel, contenido })
			.select();

		let note: Nota;
		if (res.data) {
			note = res.data[0];
			dispatcher('create-note', {
				note
			});
		}

		loading = false;
	};
	const setLimitText = () => {
		contenido = contenido.length < 18 ? contenido : contenido.substring(0, 18);
	};
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg right-0 top-10  dark:bg-stone-800"
	transition:fly
>
	<label class="dark:text-stone-400" for="nivel">Nivel de alerta</label>
	<select
		id="nivel"
		name="alerta"
		bind:value={nivel}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
	>
		<option value="ok">normal</option>
		<option value="warn">importante</option>
		<option value="alert">urgente</option>
	</select>
	<label class="dark:text-stone-400" for="modulo">Modulo al que pertenece</label>
	<select
		id="modulo"
		name="modulo"
		bind:value={modulo}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
	>
		<option value="/nomina">nomina</option>
		<option value="/licencias">licencias</option>
	</select>
	<label class="dark:text-stone-400" for="contenido">Contenido de la nota</label>
	<textarea
		id="contenido"
		name="contenido"
		bind:value={contenido}
		on:input={setLimitText}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
	/>
	<button
		class="bg-lime-500 rounded-lg p-1 hover:bg-lime-400 flex justify-center items-center"
		on:click={createNote}
		>{#if loading} <Spinner /> {:else} Agregar nota {/if}</button
	>
</div>
