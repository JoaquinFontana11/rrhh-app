<script lang="ts">
	import { Icon, X, CheckCircle, Exclamation, ExclamationCircle } from 'svelte-hero-icons';
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Nota } from '$lib/types';
	export let note: Nota;
	console.log('renderizado: ', note);
	const dispatcher = createEventDispatcher();
</script>

<div
	class="w-2/3 h-auto bg-white border border-white dark:bg-stone-800 rounded-md shadow-xl p-5 flex justify-start items-center  gap-2 dark:border-stone-700 "
>
	<div
		class="w-8"
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
			class="w-8 h-8 "
		/>
	</div>
	<p class="grow dark:text-stone-100">
		{note.contenido}
	</p>
	<button
		on:click={async () => {
			await supabase.from('notas').delete().eq('id', note.id);
			dispatcher('delete-note', { id: note.id });
		}}
	>
		<Icon src={X} class="w-6 h-6 text-stone-400 hover:text-stone-600" />
	</button>
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
</style>
