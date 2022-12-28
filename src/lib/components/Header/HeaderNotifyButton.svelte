<script lang="ts">
	import SidebarButton from '../Sidebar/SidebarButton.svelte';

	export let text: String;
	export let type: String;
	let styleAdd =
		'relative w-auto p-2 h-10 rounded-lg bg-lime-500 text-black hover:bg-lime-300 hover:text-gray-900 flex justify-center items-center dark:hover:bg-lime-900 dark:hover:text-stone-300';
	let styleNotAdd =
		'relative w-10 h-10 rounded-lg bg-stone-300 text-black hover:bg-gray-200 hover:text-gray-900 flex justify-center items-center dark:hover:bg-stone-800 dark:hover:text-stone-300';
	let styleSelected =
		'relative w-10 h-10 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-200 hover:text-gray-900 flex justify-center items-center dark:hover:bg-stone-800 dark:hover:text-stone-300';
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
