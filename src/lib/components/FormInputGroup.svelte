<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import type { IComponent } from '$lib/types';
	import FormInputDate from './Inputs/FormInputDate.svelte';
	import FormInputNumber from './Inputs/FormInputNumber.svelte';
	import FormInputSelect from './Inputs/FormInputSelect.svelte';
	import FormInputText from './Inputs/FormInputText.svelte';
	import FormInputEmail from './Inputs/FormInputEmail.svelte';
	// import Spinner from '$lib/components/Spinner.svelte';

	const dispatch = createEventDispatcher();

	export let components: IComponent[];

	// agregamos validadores custom
	export let validators: Function = () => {
		return { status: true };
	};

	onDestroy(async () => {
		const formData = new FormData();

		// pasamos todos los valores del formualrio a FormData
		try {
			await Promise.all(
				components.map(async (component) => {
					formData.append(component.name, component.value);
				})
			);
			console.log('---------------------------');
			console.log([...formData]);
		} catch (err) {
			console.log('---------------------------');
			console.log(err);
		}
		dispatch('destroy', validators([...formData]));
	});
</script>

<div class="py-1 text-sm text-gray-700 dark:text-gray-200 flex flex-col justify-center">
	{#each components as component}
		{#if component.type == 'text'}
			<FormInputText
				label={component.label}
				bind:value={component.value}
				required={component.required}
			/>
		{:else if component.type == 'email'}
			<FormInputEmail
				label={component.label}
				bind:value={component.value}
				required={component.required}
			/>
		{:else if component.type == 'number'}
			<FormInputNumber
				label={component.label}
				bind:value={component.value}
				required={component.required}
			/>
		{:else if component.type == 'date'}
			<FormInputDate
				label={component.label}
				bind:value={component.value}
				required={component.required}
			/>
		{:else if component.type == 'select'}
			<FormInputSelect
				label={component.label}
				options={component.options}
				bind:value={component.value}
				required={component.required}
			/>
		{/if}
	{/each}
</div>
