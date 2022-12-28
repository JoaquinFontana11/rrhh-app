<script lang="ts">
	import SidebarButton from '../Sidebar/SidebarButton.svelte';

	export let text: String;
	export let type: String;
	let styleAdd =
		'relative w-auto p-2 h-10 rounded-lg bg-lime-500 text-black hover:bg-lime-300 hover:text-gray-900 flex justify-center items-center dark:hover:bg-lime-900 dark:hover:text-stone-300';
	let styleNotAdd =
		'relative w-10 h-10 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-black flex justify-center items-center dark:hover:bg-stone-600 dark:hover:text-stone-300';
	let styleSelected =
		'relative w-10 h-10 rounded-lg bg-stone-700 text-black flex justify-center items-center dark:bg-stone-600 dark:text-stone-300';
	let selected = false;
</script>

<button
	class={type == 'add' ? styleAdd : selected ? styleSelected : styleNotAdd}
	on:click={() => {
		if (type != 'add') {
			selected = !selected;
		}
	}}
>
	{text}
</button>
