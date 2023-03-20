<script lang="ts">
	import {
		Icon,
		CheckCircle,
		Exclamation,
		ExclamationCircle,
		Check,
		User
	} from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Nota, Usuario } from '$lib/types';
	import type { PostgrestResponse } from '@supabase/supabase-js';
	import Spinner from 'svelte-spinner';
	import CircleUser from '$lib/components/Note/CircleUser.svelte';

	export let note: Nota;
	export let modify: boolean = true;
	export let usuarios: Usuario[] = [];
	const dispatcher = createEventDispatcher();
	let showEditTitle = false;
	let showEditContent = false;
	let loading = false;
	/* let usuarios: Usuario[] = []; */
	const setLimitText = () => {
		note.titulo = note.titulo.length < 18 ? note.titulo : note.titulo.substring(0, 18);
	};

	/* 	const getTaggedUsers = async () => {
		const users: PostgrestResponse<{ usuario: Usuario }> = await supabase
			.from('usuariosEtiquetados')
			.select('usuario(*)')
			.eq('nota', note.id);
		console.log(users.data);
		users.data?.map((user) => {
			usuarios.push(user.usuario);
		});
		console.log(usuarios);
	};
	getTaggedUsers();
	console.log(usuarios); */
	console.log(usuarios);
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
		{#if showEditTitle && modify}
			<div class="flex flex-row items-center">
				<input
					id="titulo"
					name="titulo"
					type="text"
					bind:value={note.titulo}
					on:input={setLimitText}
					class=" bg-white border border-stone-200 rounded-lg outline-none p-2 dark:bg-stone-800 dark:border-stone-500 dark:text-stone-100 "
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
						<Icon
							src={Check}
							class="ml-2 w-8 h-8 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
						/>
					{/if}</button
				>
			</div>
		{:else}
			<p
				class=" dark:text-stone-100 text-xl font-medium w-auto"
				on:dblclick={() => {
					if (modify) showEditTitle = true;
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
	<hr class=" my-1 h-0.5 bg-stone-300 dark:bg-stone-900" />
	<div class="flex flex-col">
		<div class="p-3">
			<p class="text-lg font-medium mb-2 dark:text-stone-100 ">Personas Etiquetadas</p>
			<div class="flex flex-row gap-1 ">
				{#each usuarios as usuario}
					<CircleUser user={usuario} />
				{/each}
				<button
					class="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border border-black hover:bg-stone-200"
				>
					+
				</button>
			</div>
		</div>
		<div class="p-3">
			<p class="text-lg font-medium mb-2 dark:text-stone-100">Contenido</p>
			{#if showEditContent && modify}
				<textarea
					id="contenido"
					name="contenido"
					bind:value={note.contenido}
					on:input={setLimitText}
					class="resize-none bg-white border border-stone-200 rounded-lg p-1 outline-none h-56 w-full dark:bg-stone-800 dark:border-stone-500 dark:text-stone-100 "
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
							<Icon
								src={Check}
								class="w-8 h-8 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
							/>
						{/if}</button
					>
				</div>
			{:else}
				<div
					class="border rounded-lg p-2 overflow-y-scroll h-56 scrollbar-thin scrollbar-thumb-stone-500/20 dark:scrollbar-thumb-stone-700 dark:text-stone-100 dark:border-stone-500 "
					on:dblclick={() => {
						if (modify) showEditContent = true;
					}}
				>
					{note.contenido}
				</div>
			{/if}
		</div>
	</div>
	<div class="flex absolute bottom-0 right-0 mb-3 mr-5 gap-3">
		<button
			class="flex flex-row border p-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:hover:bg-stone-600 dark:bg-stone-700 disabled:dark:bg-stone-600"
			class:disabled={showEditTitle || showEditContent}
			disabled={showEditContent || showEditTitle}
			on:click={() => {
				dispatcher('close-note', {});
			}}
		>
			<Icon src={Check} class="w-6 h-6 text-stone-400 dark:text-stone-100" />
			<span class="dark:text-stone-100">Aceptar</span>
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
