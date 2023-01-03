<script lang="ts">
	import { Icon, Trash } from 'svelte-hero-icons';
	import { fly } from 'svelte/transition';
	import showStore from '$lib/stores/showStore';
	import { showAllStore } from '$lib/stores/showStore';

	export let fields: string[] = [];

	let field: string;

	showStore.subscribe((val) => {
		localStorage.setItem('show', JSON.stringify(val));
	});
	showAllStore.subscribe((val: boolean) => {
		localStorage.setItem('showAll', val.toString());
	});
</script>

<div
	class="absolute flex flex-col gap-2 bg-white p-5 z-50 rounded-lg shadow-lg left-1/2 -translate-x-1/2 dark:bg-stone-800"
	transition:fly
>
	<label class="dark:text-stone-400">Campo</label>
	<select
		bind:value={field}
		class="bg-white border border-stone-200 rounded-lg outline-none p-1 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 "
	>
		{#each fields as field}
			<option>{field}</option>
		{/each}
	</select>
	<button
		class="bg-lime-500 rounded-lg p-1"
		on:click={() => {
			showStore.update((showStoreValue) => {
				if (!field) return showStoreValue;
				showStoreValue = showStoreValue.filter((f) => f.field !== field);

				showStoreValue.push({
					field
				});
				return showStoreValue;
			});
		}}>Agregar campo</button
	>
	<button
		class=" rounded-lg p-1"
		class:green={$showAllStore}
		class:red={!$showAllStore}
		on:click={() => {
			showAllStore.update((showAllStoreValue) => !showAllStoreValue);
		}}>Mostrar todo ({`${$showAllStore ? 'ON' : 'OFF'}`})</button
	>
	<p class="dark:text-stone-400">Campos visibles</p>
	{#each $showStore as showValue}
		<div class="flex justify-between bg-lime-100 p-1 rounded-lg gap-2">
			<p class="flex justify-center grow gap-5">
				{showValue.field}
			</p>
			<button
				class="mr-2"
				on:click={() => {
					showStore.update((showStoreValue) => {
						return showStoreValue.filter((f) => f.field !== showValue.field);
					});
				}}
			>
				<Icon src={Trash} class="w-4 h-4 hover:text-stone-600" />
			</button>
		</div>
	{:else}
		<p class="dark:text-stone-400">No tenes ningun campo visible activo 🧐</p>
	{/each}
</div>

<style lang="postcss">
	.green {
		@apply bg-lime-500;
	}
	.red {
		@apply bg-rose-500;
	}
</style>
