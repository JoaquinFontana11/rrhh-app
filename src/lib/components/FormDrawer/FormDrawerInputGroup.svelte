<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import type { IComponent } from '$lib/types';
	import FormDrawerInput from './FormDrawerInput.svelte';
	// import Spinner from '$lib/components/Spinner.svelte';

	const dispatch = createEventDispatcher();

	export let components: IComponent[];
	export let formName: string;
	export let validateAllInputs: boolean = false;

	const validateAll = () => {
		let res;
		for (const component of components) {
			let status: boolean = true;
			component.validators.forEach((validator) => {
				//res = component.required ? validator(component.value) : null;
				res = validator(component.value);
				status = res && !res.status ? res.status : status;
			});
			if (!status) return { form: formName, status };
		}
		return { form: formName, status: true };
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
		} catch (err) {
			console.log(err);
		}
		validateAll();
		dispatch('destroy', validateAll());
	});

	console.log(validateAllInputs);
</script>

<div class="py-1 text-sm text-gray-700 dark:text-gray-200 flex flex-col justify-center w-full">
	{#each components as component}
		<FormDrawerInput
			label={component.label}
			bind:value={component.value}
			required={component.required}
			type={component.type}
			options={component.options}
			name={component.name}
			on:input
			validators={component.validators}
			runValidate={validateAllInputs}
		/>
	{/each}
</div>
