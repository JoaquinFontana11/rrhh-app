<script lang="ts">
	import { validateInputEmail } from './validators';

	export let value: string;
	export let label: string;
	export let required = false;

	const error = {
		input:
			'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-stone-900 focus:border-red-500 block w-full p-1 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500',
		message: 'block text-red-600 dark:text-red-500 mb-2 text-xs font-medium'
	};

	let styleInput =
		'focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1 dark:bg-stone-900 dark:border-stone-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
	let styleMessage = 'hidden';
	let errorMsg = '';

	const validateInput = (e: Event) => {
		({
			message: errorMsg,
			inputStyle: styleInput,
			messageStyle: styleMessage
		} = validateInputEmail(value, error));
	};
</script>

<div>
	<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" for={label}
		>{label}</label
	>
	<input
		id={label}
		type="email"
		class={styleInput}
		{required}
		bind:value
		on:blur|preventDefault={required ? validateInput : ''}
	/>
	<label class={styleMessage} for={label}>{errorMsg}</label>
</div>
