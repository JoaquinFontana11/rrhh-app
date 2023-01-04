<script lang="ts">
</script>

<!--

    <div
	class="relative top-0 left-0 h-screen w-screen bg-black opacity-25"
	transition:fade={{ duration: 500 }}
    />
-->
<aside
	class="z-10 relative left-15 top-0 h-full bg-white w-auto  dark:bg-stone-900 drawer overflow-y-scroll scrollbar-thin scrollbar-w-1 scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700"
>
	<button on:click class=" px-2 m-1 rounded-lg text-red-500">X</button>
	<slot />
</aside>

<style lang="postcss">
	.drawer {
		height: calc(100vh - 56px);
	}
</style>
