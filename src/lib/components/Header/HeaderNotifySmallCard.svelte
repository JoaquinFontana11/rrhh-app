<script lang="ts">
	import { Icon, CheckCircle, Exclamation, ExclamationCircle } from 'svelte-hero-icons';
	import type { Nota } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let nota: Nota;
	let icon: { [key: string]: any } = {
		ok: CheckCircle,
		warn: Exclamation,
		alert: ExclamationCircle
	};

	const dispatcher = createEventDispatcher();
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
