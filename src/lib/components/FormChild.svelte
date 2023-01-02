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
	// export let title: string;
	// export let submitMessage: string;
	// export let loading: boolean;
	export let action: string = 'create';

	// si es necesario agregar una logica EXTRA al proceso de submit agregamos esta funcion
	export let addExtraData: Function = () => [];

	// agregamos validadores custom
	export let validators: Function = () => {
		return { status: true };
	};

	// transforma una fila en base64
	const fileToBase64 = async (file) => {
		let base64: string = await new Promise((resolve) => {
			let fileReader = new FileReader();
			fileReader.onload = (e) => resolve(fileReader.result as string);
			fileReader.readAsDataURL(file);
		});
		return base64.split(',')[1];
	};

	const handlerSubmit = async (e: Event) => {
		const formData = new FormData();

		// pasamos todos los valores del formualrio a FormData
		try {
			await Promise.all(
				components.map(async (component) => {
					// si es de tipo objetc es porque es un File por eso lo pasamos a base 64
					if (typeof component.value == 'object') {
						formData.append(component.name, await fileToBase64(component.value[0]));
						formData.append('name', component.value[0].name);
					} else formData.append(component.name, component.value);
				})
			);
			console.log('---------------------------');
			console.log([...formData][0].length);
		} catch (err) {
			console.log('---------------------------');
			console.log(err);
		}
		// agregamos o no data extra
		addExtraData(components).forEach((component) => {
			formData.append(component.name, component.value);
		});

		console.log([...formData]);

		// informamos si las valiaciones fueron correctas o no
		dispatch('validation-end', validators([...formData]));

		console.log('------- FORMDATA -------');
		console.log([...formData]);

		if (!validators([...formData]).status) return;
		await fetch(`?/${action}`, {
			method: 'POST',
			body: formData
		});
	};
	onDestroy(async () => {
		const formData = new FormData();

		// pasamos todos los valores del formualrio a FormData
		try {
			await Promise.all(
				components.map(async (component) => {
					// si es de tipo objetc es porque es un File por eso lo pasamos a base 64
					if (typeof component.value == 'object') {
						formData.append(component.name, await fileToBase64(component.value[0]));
						formData.append('name', component.value[0].name);
					} else formData.append(component.name, component.value);
				})
			);
			console.log('---------------------------');
			console.log([...formData][0].length);
		} catch (err) {
			console.log('---------------------------');
			console.log(err);
		}
		dispatch('destroy', validators([...formData]));
	});
</script>

<form
	class="py-1 text-sm text-gray-700 dark:text-gray-200 flex flex-col justify-center items-center"
>
	<!-- Dejamos un slot para ampliar la funcionalidad del formulario dependiendo la necesidad -->
	<slot name="top-slot" />
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
			<!-- {:else if component.type == 'file'}
			<FormInputFile label={component.label} bind:files={component.value} />
		{:else if component.type == 'image'}
			<FormInputFileImage label={component.label} bind:files={component.value} />
		{:else if component.type == 'editor'}
			<FormEditor label={component.label} bind:value={component.value} />
		{:else if component.type == 'select-image'}
			<FormInputSelectImage
				label={component.label}
				bind:value={component.value}
				images={component.images}
			/>
		{:else if component.type == 'big-select-image'}
			<FormInputBigSelectImage
				label={component.label}
				bind:value={component.value}
				images={component.images}
			/> -->
		{/if}
	{/each}
	<!-- Dejamos un slot para ampliar la funcionalidad del formulario dependiendo la necesidad -->
	<slot name="bottom-slot" />
</form>
