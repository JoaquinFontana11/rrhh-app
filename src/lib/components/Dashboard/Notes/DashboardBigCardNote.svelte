<script lang="ts">
	import { Icon, CheckCircle, Exclamation, ExclamationCircle, Check } from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Nota, Usuario } from '$lib/types';
	import { fly } from 'svelte/transition';
	import Spinner from 'svelte-spinner';
	import CircleUser from '$lib/components/Note/CircleUser.svelte';
	import { clickOutside } from '$lib/clickOutside';

	export let note: Nota;
	export let modify: boolean = true;
	export let usuarios: Usuario[] = [];
	export let allUsers: Usuario[] = [];
	const dispatcher = createEventDispatcher();
	let showEditTitle = false;
	let showEditContent = false;
	let showAddTagger = false;
	let newTagger: Usuario = {
		id: 0,
		nombre: '',
		apellido: '',
		color: '',
		created_at: 0,
		usuario: ''
	};
	let loading = false;

	const setLimitText = () => {
		note.titulo = note.titulo.length < 32 ? note.titulo : note.titulo.substring(0, 32);
	};

	const handleClickOutside = (e: any) => {
		showAddTagger = false;
	};

	const addNewTagger = async (e: Event) => {
		const res = await supabase
			.from('usuariosEtiquetados')
			.insert({ nota: note.id, usuario: newTagger.id })
			.select();

		showAddTagger = false;
		dispatcher('refresh-users', {});
	};

	const deleteUser = async (e: CustomEvent) => {
		const res = await supabase
			.from('usuariosEtiquetados')
			.delete()
			.eq('usuario', e.detail.id)
			.eq('nota', note.id);
		dispatcher('refresh-users', {});
	};
</script>

<div
	class={`w-[34rem] h-[34rem] bg-white border border-white dark:bg-stone-800 rounded-md shadow-xl p-2 flex flex-col gap-2 dark:border-2 ${
		note.nivel == 'ok'
			? 'dark:border-DPMA-Succes'
			: note.nivel == 'warn'
			? 'dark:border-DPMA-Yellow'
			: 'dark:border-DPMA-Rose'
	}`}
>
	<div
		class="flex items-center justify-center p-2 rounded-md"
		class:bg-ok={note.nivel == 'ok'}
		class:bg-warn={note.nivel == 'warn'}
		class:bg-alert={note.nivel == 'alert'}
	>
		{#if showEditTitle && modify}
			<div class="flex flex-row items-center">
				<input
					id="titulo"
					name="titulo"
					type="text"
					bind:value={note.titulo}
					on:input={setLimitText}
					class={` rounded-lg outline-none p-2  dark:text-stone-100 w-96 ${
						note.nivel == 'ok'
							? 'bg-light-Succes border-DPMA-Succes dark:bg-dark-Succes'
							: note.nivel == 'warn'
							? 'bg-light-Yellow border-DPMA-Yellow dark:bg-dark-Yellow'
							: 'bg-light-Rose border-DPMA-Rose dark:bg-dark-Rose'
					}`}
				/>
				<button
					on:click={async () => {
						if (loading) return;
						loading = true;
						await supabase.from('notas').update({ titulo: note.titulo }).eq('id', note.id);
						dispatcher('initLong', {});
						showEditTitle = false;
						loading = false;
					}}
					>{#if loading}
						<Spinner />
					{:else}
						<Icon src={Check} class="ml-2 w-8 h-8 text-stone-700 hover:text-stone-900 " />
					{/if}</button
				>
			</div>
		{:else}
			<p
				class=" dark:text-stone-100 text-xl font-medium w-auto"
				on:dblclick={() => {
					if (modify) {
						showEditTitle = true;
						dispatcher('stopLong', {});
					}
				}}
			>
				{note.titulo}
			</p>
		{/if}
	</div>
	<hr class=" my-1 h-0.5 bg-stone-300 dark:bg-stone-900" />
	<div class="flex flex-col">
		<div class="p-3">
			<p class="text-lg font-medium mb-2 dark:text-stone-100 ">Personas Etiquetadas</p>
			<div class="flex flex-row gap-1 items-center">
				{#each usuarios as usuario}
					<CircleUser user={usuario} on:delete-user={deleteUser} {modify} />
				{/each}
				{#if modify}
					<button
						class="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-600 flex items-center justify-center border border-black hover:bg-stone-200 dark:hover:bg-stone-500"
						on:click={() => {
							showAddTagger = !showAddTagger;
						}}
					>
						+
					</button>
				{/if}
				{#if showAddTagger && modify}
					<div
						class="bg-white drop-shadow-lg w-40 z-50 h-6 rounded-md dark:bg-stone-800"
						transition:fly
						use:clickOutside
						on:click_outside={handleClickOutside}
					>
						<select
							name="newTagger"
							id="newTagger"
							bind:value={newTagger}
							class="w-full bg-stone-100 dark:bg-stone-500"
							on:change={addNewTagger}
						>
							<option value={newTagger} disabled selected />
							{#each allUsers as user}
								<option value={user}>{user.nombre} {user.apellido}</option>
							{/each}
						</select>
					</div>
				{/if}
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
							dispatcher('initLong', {});
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
						if (modify) {
							showEditContent = true;
							dispatcher('stopLong', {});
						}
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
	.bg-ok {
		@apply bg-DPMA-Succes;
	}
	.bg-warn {
		@apply bg-DPMA-Yellow;
	}
	.bg-alert {
		@apply bg-DPMA-Rose;
	}
	.disabled {
		@apply bg-stone-50 cursor-not-allowed;
	}
</style>
