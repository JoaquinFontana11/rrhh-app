<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import type { IComponent } from '$lib/types';
	import FormDrawerInput from './FormDrawerInput.svelte';
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
		} catch (err) {}
		dispatch('destroy', validators([...formData]));
	});
</script>

<div class="py-1 text-sm text-gray-700 dark:text-gray-200 flex flex-col justify-center">
	{#each components as component}
		<FormDrawerInput
			label={component.label}
			bind:value={component.value}
			required={component.required}
			type={component.type}
			options={component.options}
			validators={component.validators}
		/>
	{/each}
</div>
