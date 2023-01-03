<script lang="ts">
</script>

<!--

    <div
	class="relative top-0 left-0 h-screen w-screen bg-black opacity-25"
	transition:fade={{ duration: 500 }}
    />
-->
<aside
	class="z-10 relative left-15 top-0 h-full bg-white w-56  dark:bg-stone-900 drawer overflow-y-scroll scrollbar-thin scrollbar-w-2"
>
	<button
		on:click
		class="border px-2 m-1 rounded-lg bg-red-600 text-stone-800 border-stone-800 dark:border-stone-300 dark:text-stone-300"
		>X</button
	>
	<slot />
</aside>

<style lang="postcss">
	.drawer {
		height: calc(100vh - 56px);
	}
</style>
