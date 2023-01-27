<script lang="ts">
	import DashboardCalendarCellItem from './DashboardCalendarCellItem.svelte';
	export let day: number | string;
	export let items: { color: string; content: string }[] = [];
</script>

<div
	class="w-full h-full flex justify-center items-center relative overflow-y-scroll scrollbar-none"
>
	<span class="absolute top-3 left-3 text-stone-500 dark:text-stone-600"> {day}</span>
	<div class="flex flex-col absolute top-10 left-4 w-full">
		{#each items as item}
			<DashboardCalendarCellItem color={item.color} content={item.content} />
		{/each}
	</div>
</div>
