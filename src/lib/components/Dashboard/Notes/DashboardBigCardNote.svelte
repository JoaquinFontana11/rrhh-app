<script lang="ts">
	import { Icon, CheckCircle, Exclamation, ExclamationCircle, Check } from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Nota } from '$lib/types';
	import Spinner from 'svelte-spinner';

	export let note: Nota;
	const dispatcher = createEventDispatcher();
	let showEditTitle = false;
	let showEditContent = false;
	let loading = false;

	const setLimitText = () => {
		note.titulo = note.titulo.length < 18 ? note.titulo : note.titulo.substring(0, 18);
	};
</script>

<div
	class="w-[34rem] h-[34rem] bg-white border border-white dark:bg-stone-800 rounded-md shadow-xl p-2 flex flex-col gap-2 dark:border-stone-700 "
>
	<div class="flex items-center justify-between gap-2">
		<div
			class="w-12"
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
				class="w-12 h-12 "
			/>
		</div>
		{#if showEditTitle}
			<div class="flex flex-row items-center">
				<input
					id="titulo"
					name="titulo"
					type="text"
					bind:value={note.titulo}
					on:input={setLimitText}
					class=" bg-white border border-stone-200 rounded-lg outline-none p-2 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
				/>
				<button
					on:click={async () => {
						if (loading) return;
						loading = true;
						await supabase.from('notas').update({ titulo: note.titulo }).eq('id', note.id);
						showEditTitle = false;
						loading = false;
					}}
					>{#if loading}
						<Spinner />
					{:else}
						<Icon src={Check} class="ml-2 w-8 h-8 text-stone-400 hover:text-stone-600" />
					{/if}</button
				>
			</div>
		{:else}
			<p
				class=" dark:text-stone-100 text-xl font-medium w-auto"
				on:dblclick={() => {
					showEditTitle = true;
				}}
			>
				{note.titulo}
			</p>
		{/if}
		<div
			class="w-12"
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
				class="w-12 h-12 "
			/>
		</div>
	</div>
	<hr class=" my-1 h-0.5 bg-stone-300" />
	<div class="flex flex-col">
		<div class="p-3">
			<p class="text-lg font-medium mb-2">Personas Etiquetadas</p>
			<div>Aca van las personas</div>
		</div>
		<div class="p-3">
			<p class="text-lg font-medium mb-2">Contenido</p>
			{#if showEditContent}
				<textarea
					id="contenido"
					name="contenido"
					bind:value={note.contenido}
					on:input={setLimitText}
					class="resize-none bg-white border border-stone-200 rounded-lg p-1 outline-none h-56 w-full dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
				/>
				<div class="flex justify-end">
					<button
						on:click={async () => {
							if (loading) return;
							loading = true;
							await supabase.from('notas').update({ contenido: note.contenido }).eq('id', note.id);
							showEditContent = false;
							loading = false;
						}}
						>{#if loading}
							<Spinner />
						{:else}
							<Icon src={Check} class="w-8 h-8 text-stone-400 hover:text-stone-600" />
						{/if}</button
					>
				</div>
			{:else}
				<div
					class="border rounded-lg p-2 overflow-y-scroll h-56 scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700"
					on:dblclick={() => {
						showEditContent = true;
					}}
				>
					{note.contenido}
				</div>
			{/if}
		</div>
	</div>
	<div class="flex absolute bottom-0 right-0 mb-3 mr-5 gap-3">
		<button
			class="flex flex-row border p-2 rounded-lg hover:bg-stone-50"
			class:disabled={showEditTitle || showEditContent}
			disabled={showEditContent || showEditTitle}
			on:click={() => {
				dispatcher('close-note', {});
			}}
		>
			<Icon src={Check} class="w-6 h-6 text-stone-400" /> <span>Aceptar</span>
		</button>
	</div>
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
	.disabled {
		@apply bg-stone-50 cursor-not-allowed;
	}
</style>
