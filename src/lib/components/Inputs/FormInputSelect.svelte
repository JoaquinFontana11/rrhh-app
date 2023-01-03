<script lang="ts">
	import { validateEmptyInput } from './validators';
	import { createEventDispatcher } from 'svelte';

	export let value: string | number | Date | boolean;
	export let label: string;
	export let required = false;
	export let options: any;

	const error = {
		input:
			'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-stone-900 focus:border-red-500 block w-full p-1 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500',
		message: 'block text-red-600 dark:text-red-500 mb-2 text-xs font-medium'
	};

	let styleInput =
		'focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1 dark:bg-stone-900 dark:border-stone-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
	let styleMessage = 'hidden';
	let errorMsg = '';

	const dispatch = createEventDispatcher();

	const validateInput = (e: Event) => {
		({
			message: errorMsg,
			inputStyle: styleInput,
			messageStyle: styleMessage
		} = validateEmptyInput(value, error));
	};
	const onChange = async (e: Event) => {
		dispatch('custom-change', {
			data: e.target.value
		});
	};
</script>

<div>
	<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" for={label}
		>{label}</label
	>
	<select
		id={label}
		class={styleInput}
		{required}
		bind:value
		on:blur|preventDefault={required ? validateInput : ''}
		on:change|preventDefault={onChange}
	>
		{#each options as option}
			<option value={option.value}>{option.name}</option>
		{/each}
	</select>
	<label class={styleMessage} for={label}>{errorMsg}</label>
</div>
