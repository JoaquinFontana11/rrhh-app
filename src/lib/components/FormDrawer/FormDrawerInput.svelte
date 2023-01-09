<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	import { Icon, ExclamationCircle } from 'svelte-hero-icons';
	export let value: string;
	export let label: string;
	export let required = false;
	export let type: string = 'text';
	export let options: any = {};
	export let validators: Array<Function>;
	export let runValidate: boolean;

	let errors: Array<string> = [];
	let status: boolean = false;
	let viewErrors: boolean = false;

	const dispatch = createEventDispatcher();

	const validateInput = (e: Event) => {
		let res;
		errors = [];
		validators.forEach((validator) => {
			res = validator(value);
			if (res && res.message) errors.push(res.message);
		});
		status = errors.length > 0 ? true : false;
	};

	// esto esta para que si se abre la segunda vez en input group se muestren todos los validadores
	if (runValidate) validateInput();
</script>

<!--

	<div class="grid grid-cols-6 mb-2 mx-2 ">
-->
<div class="flex m-2 relative">
	<label
		class=" block  mr-8 text-sm font-medium text-stone-900 dark:text-stone-400 w-2/4"
		for={label}
		>{label}
	</label>
	{#if status}
		<div class="absolute left-1/4  h-full ">
			<div
				on:mouseenter={() => {
					viewErrors = true;
				}}
				on:mouseleave={() => {
					viewErrors = false;
				}}
				class="flex justify-center items-center h-full "
			>
				<Icon src={ExclamationCircle} class="text-red-500 w-6 h-6 ml-5" />
			</div>

			{#if viewErrors}
				<div
					class="z-[100] absolute translate-y-1 translate-x-6 bg-stone-900 text-stone-300 p-3 rounded-md text-[12px] w-64 dark:bg-black"
					style="z-index: 1000"
					transition:fade={{ duration: 50 }}
				>
					<ul class="list-disc ml-3">
						{#each errors as error}
							<li>
								{error}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}

	{#if type == 'number'}
		<input
			id={label}
			type="number"
			{name}
			class:error={status}
			class="outline-none col-span-4 col-start-3 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-800 focus:border-stone-800 block w-full p-1 dark:bg-stone-800 dark:text-stone-500 dark:focus:text-stone-200  dark:border-stone-600 dark:focus:border-stone-500 "
			{required}
			bind:value
			on:input|preventDefault={required ? validateInput : null}
			on:input
		/>
	{:else if type == 'text'}<input
			id={label}
			type="text"
			{name}
			class:error={status}
			class="outline-none col-span-4 col-start-3 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-800 focus:border-stone-800 block w-full p-1 dark:bg-stone-800 dark:text-stone-500 dark:focus:text-stone-200  dark:border-stone-600 dark:focus:border-stone-500"
			{required}
			bind:value
			on:input|preventDefault={required ? validateInput : null}
			on:input
		/>
	{:else if type == 'date'}<input
			id={label}
			type="date"
			{name}
			class:error={status}
			class="outline-none col-span-4 col-start-3 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-800 focus:border-stone-800 block w-full p-1 dark:bg-stone-800 dark:text-stone-500 dark:focus:text-stone-200  dark:border-stone-600 dark:focus:border-stone-500"
			{required}
			bind:value
			on:input|preventDefault={required ? validateInput : null}
			on:input
		/>
	{:else if type == 'email'}
		<input
			id={label}
			type="email"
			{name}
			class="outline-none col-span-4 col-start-3 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-800 focus:border-stone-800 block w-full p-1 dark:bg-stone-800 dark:text-stone-500 dark:focus:text-stone-200  dark:border-stone-600 dark:focus:border-stone-500"
			class:error={status}
			{required}
			bind:value
			on:input|preventDefault={required ? validateInput : null}
			on:input
		/>
	{:else if type == 'select'}
		<select
			id={label}
			{name}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
			on:input
			class:error={status}
			class="outline-none col-span-4 col-start-3 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-800 focus:border-stone-800 block w-full p-1 dark:bg-stone-800 dark:text-stone-500 dark:focus:text-stone-200  dark:border-stone-600 dark:focus:border-stone-500"
		>
			{#each options as option}
				<option value={option.value}>{option.name}</option>
			{/each}
		</select>
	{/if}
</div>

<style>
	.error {
		@apply border-rose-500 text-rose-500;
	}
</style>
