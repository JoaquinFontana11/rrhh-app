<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	import { Icon, ExclamationCircle } from 'svelte-hero-icons';
	import { error } from '@sveltejs/kit';
	export let value: string;
	export let label: string;
	export let required = false;
	export let type: string = 'text';
	export let options: any = {};
	export let validators: Array<Function>;

	let errors: Array<string> = [];
	let status: boolean = false;
	let viewErrors: boolean = false;

	const styleError =
		' col-span-4 col-start-3 bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-stone-900 focus:border-red-500 block w-full p-1 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500';
	const styleDefault =
		'outline-none col-span-4 col-start-3 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-800 focus:border-stone-800 block w-full p-1 dark:bg-stone-900 dark:text-white dark:focus:ring-stone-50 dark:focus:border-stone-50';

	const dispatch = createEventDispatcher();

	const validateInput = (e: Event) => {
		let res;
		errors = [];
		validators.forEach((validator) => {
			res = validator(value);
			console.log(res);
			if (res && res.message) errors.push(res.message);
		});
		status = errors.length > 0 ? true : false;
		console.log(errors);
		console.log(errors.length);
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
			class={status ? styleError : styleDefault}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
			on:input
		/>
	{:else if type == 'text'}<input
			id={label}
			type="text"
			{name}
			class={status ? styleError : styleDefault}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
			on:input
		/>
	{:else if type == 'date'}<input
			id={label}
			type="date"
			{name}
			class={status ? styleError : styleDefault}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
			on:input
		/>
	{:else if type == 'email'}
		<input
			id={label}
			type="email"
			{name}
			class={status ? styleError : styleDefault}
			{required}
			bind:value
			on:blur|preventDefault={required ? validateInput : null}
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
			class={status ? styleError : styleDefault}
		>
			{#each options as option}
				<option value={option.value}>{option.name}</option>
			{/each}
		</select>
	{/if}
</div>
