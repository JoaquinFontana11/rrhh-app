<script lang="ts">
	export let options: { name: string; value: any }[];
</script>

<select
	class={`
	 p-1 outline-none border border-stone-200 bg-white   text-sm rounded-md flex gap-2 justify-center items-center dark:bg-stone-900 dark:border-stone-700 dark:text-stone-500`}
	on:input
>
	{#each options as option}
		<option value={option.value}> {option.name}</option>
	{/each}
</select>
