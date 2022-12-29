<script lang="ts">
	import { validateInputText } from './validators';

	export let value: string;
	export let label: string;
	export let required = false;

	const error = {
		input:
			'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-1 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500',
		message: 'block text-red-600 dark:text-red-500 mb-1 text-xs font-medium'
	};

	let styleInput =
		'focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
	let styleMessage = 'hidden';
	let errorMsg = '';

	const validateInput = (e: Event) => {
		({
			message: errorMsg,
			inputStyle: styleInput,
			messageStyle: styleMessage
		} = validateInputText(value, error));
	};
</script>

<div>
	<label class=" block mb-0.5 text-sm font-medium text-gray-900 dark:text-gray-300" for={label}
		>{label}</label
	>
	<input
		id={label}
		type="text"
		class={styleInput}
		{required}
		bind:value
		on:blur|preventDefault={validateInput}
	/>
</div>
<label class={styleMessage} for={label}>{errorMsg}</label>
