<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { Icon, ExclamationCircle } from 'svelte-hero-icons';
	export let value: string;
	export let label: string;
	export let required = false;
	export let type: string = 'text';
	export let options: any = {};
	export let validators: Array<Function>;

	let errors: Array<string> = [];
	let status: boolean = false;
	let viewErrors: boolean = false;

	const dispatch = createEventDispatcher();

	const validateInput = (e: Event) => {
		let res;
		validators.forEach((validator) => {
			res = validator(value);
			console.log(res);
			if (res.message) errors.push(res.message);
		});
		status = errors.length > 0 ? true : false;
		console.log(errors);
		console.log(errors.length);
	};
	const onChange = async (e: Event) => {
		dispatch('custom-change', {
			data: e.target.value
		});
	};
</script>

<div class="grid grid-cols-6 mb-2 mx-2">
	<label class=" block mb-0.5 mr-8 text-sm font-medium text-gray-900 dark:text-gray-300" for={label}
		>{label}
	</label>
	{#if status}
		<div>
			<div
				on:mouseenter={() => {
					viewErrors = true;
				}}
				on:mouseleave={() => {
					viewErrors = false;
				}}
			>
				<Icon src={ExclamationCircle} class="text-red-500 w-6 h-6 ml-5" />
			</div>

			{#if viewErrors}
				<p
					class="absolute translate-y-1 translate-x-8 bg-stone-900 text-stone-300 p-1 rounded-md text-[12px] w-max dark:bg-black  "
					transition:fade={{ duration: 50 }}
				>
					Hola
				</p>
			{/if}
		</div>
	{/if}

	{#if type == 'number'}
		<input
			id={label}
			type="number"
			class={status ? 'error' : 'input'}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		/>
	{:else if type == 'text'}<input
			id={label}
			type="text"
			class={status ? 'error' : 'input'}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		/>
	{:else if type == 'date'}<input
			id={label}
			type="date"
			class={status ? 'error' : 'input'}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		/>
	{:else if type == 'email'}
		<input
			id={label}
			type="email"
			class={status ? 'error' : 'input'}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
		/>
	{:else if type == 'select'}
		<select
			id={label}
			class={status ? 'error' : 'input'}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
			on:change|preventDefault={onChange}
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
		@apply outline-none col-span-4 col-start-3 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-1 dark:bg-stone-900 dark:border-stone-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
	}
	.error {
		@apply col-span-4 col-start-3 bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-stone-800 focus:border-red-500 block w-full p-1 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500;
	}
</style>
