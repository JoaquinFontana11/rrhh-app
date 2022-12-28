<script lang="ts">
	import { Icon, Bell, Plus, CheckCircle, Exclamation, ExclamationCircle } from 'svelte-hero-icons';
	export let info: String;
	export let category: String;
	let styleText = {
		bien: 'text-green-500',
		alerta: 'text-yellow-500',
		peligro: 'text-red-500'
	};
	let styleBorder = {
		bien: 'border-green-500',
		alerta: 'border-yellow-500',
		peligro: 'border-red-500'
	};
	let icon = {
		bien: CheckCircle,
		alerta: Exclamation,
		peligro: ExclamationCircle
	};
</script>

<div
	class={`w-full h-auto rounded-md bg-stone-100 text-black p-1 border-2 ${styleBorder[category]} dark:bg-stone-900 dark:text-stone-100`}
>
	<div class="flex justify-between">
		<Icon src={icon[category]} class={`w-5 h-5 ${styleText[category]}`} />
	</div>

	<div class="flex flex-row gap-2 items-center">
		<p class="w-[90%]">{info}</p>
	</div>
</div>
