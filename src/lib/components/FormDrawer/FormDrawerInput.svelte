<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let value: string;
	export let label: string;
	export let required = false;
	export let type: string = 'text';
	export let options: any = {};

	//			'col-span-2 bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-stone-800 focus:border-red-500 block w-full p-1 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500',

	const dispatch = createEventDispatcher();
	const validateInput = (e: Event) => {
		// ({
		// 	message: errorMsg,
		// 	inputStyle: styleInput,
		// 	messageStyle: styleMessage
		// } = validateInputText(value, error));
	};
	const onChange = async (e: Event) => {
		dispatch('custom-change', {
			data: e.target.value
		});
	};
</script>

<div class="grid grid-cols-3 mb-2 mx-2">
	<label class=" block mb-0.5 mr-8 text-sm font-medium text-gray-900 dark:text-gray-300" for={label}
		>{label}</label
	>
	{#if type == 'number'}
		<input
			id={label}
			type="number"
			class="input"
			{name}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		/>
	{:else if type == 'text'}<input
			id={label}
			type="text"
			class="input"
			{name}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		/>
	{:else if type == 'date'}<input
			id={label}
			type="date"
			class="input"
			{name}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		/>
	{:else if type == 'email'}
		<input
			id={label}
			type="email"
			class="input"
			{name}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		/>
	{:else if type == 'select'}
		<select
			id={label}
			class="input"
			{name}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		>
			{#each options as option}
				<option value={option.value}>{option.name}</option>
			{/each}
		</select>
	{/if}
</div>

<!-- <label class={styleMessage} for={label}>{errorMsg}</label> -->
<style lang="postcss">
	.input {
		@apply outline-none col-span-2 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-1 dark:bg-stone-900 dark:border-stone-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
	}
</style>
