<script lang="ts">
	import { Icon, Bell, Plus, CheckCircle, Exclamation, ExclamationCircle } from 'svelte-hero-icons';
	export let info: string;
	export let category: string;
	let styleText = {
		ok: 'text-green-500',
		alerta: 'text-yellow-500',
		peligro: 'text-red-500'
	};
	let styleBorder = {
		bien: 'border-green-500',
		alerta: 'border-yellow-500',
		peligro: 'border-red-500'
	};
	let icon: { [key: string]: any } = {
		ok: CheckCircle,
		warn: Exclamation,
		alert: ExclamationCircle
	};
</script>

<div
	class={`w-full h-auto rounded-md bg-stone-100 text-black p-1 border-2  dark:bg-stone-900 dark:text-stone-100`}
	class:ok={category == 'ok'}
	class:warn={category == 'warn'}
	class:alert={category == 'alert'}
>
	<div class="flex justify-between">
		<Icon src={icon[category]} class={`w-5 h-5`} />
	</div>

	<div class="flex flex-row gap-2 items-center">
		<p class="w-[90%] dark:text-white text-stone-900">{info}</p>
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
