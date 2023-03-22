<script lang="ts">
	import { Icon, CheckCircle, Exclamation, ExclamationCircle } from 'svelte-hero-icons';
	import type { Nota, Usuario } from '$lib/types';
	import { createEventDispatcher, onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import CircleUser from '../Note/CircleUser.svelte';

	export let nota: Nota;
	let icon: { [key: string]: any } = {
		ok: CheckCircle,
		warn: Exclamation,
		alert: ExclamationCircle
	};
	let usuarios: Usuario[] = [];

	const dispatcher = createEventDispatcher();

	const setData = (data: { usuario: Usuario }[] | null) => {
		usuarios = [];
		if (data && data?.length > 0) {
			return data?.map((user) => {
				return user.usuario;
			});
		} else {
			return [];
		}
	};

	const getTaggedUsers = async (note_id: number) => {
		usuarios = setData(
			(await supabase.from('usuariosEtiquetados').select('usuario(*)').eq('nota', note_id)).data
		);
	};
	onMount(async () => {
		await getTaggedUsers(nota.id);
	});
</script>

<div
	class={`w-full h-auto rounded-md bg-stone-100 text-black p-1 border-2  dark:bg-stone-900 dark:text-stone-100`}
	class:ok={nota.nivel == 'ok'}
	class:warn={nota.nivel == 'warn'}
	class:alert={nota.nivel == 'alert'}
	on:dblclick={() => {
		dispatcher('show-big-note', { note: nota });
	}}
>
	<div class="flex justify-between">
		<Icon src={icon[nota.nivel]} class={`w-5 h-5`} />
		<div class="flex gap-1">
			{#each usuarios as usuario}
				<CircleUser user={usuario} modify={false} size={6} />
			{/each}
		</div>
	</div>

	<div class="flex flex-row gap-2 items-center">
		<p class="w-[90%] dark:text-white text-stone-900">{nota.titulo}</p>
	</div>
</div>

<style lang="postcss">
	.ok {
		@apply text-green-500 border-green-500;
	}
	.warn {
		@apply text-yellow-500 border-yellow-500;
	}
	.alert {
		@apply text-red-500 border-red-500;
	}
</style>
