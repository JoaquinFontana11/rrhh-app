<script lang="ts">
	import type { FunctionsObject, IComponentObject } from '$lib/types';
	import { agenteStore } from '$lib/stores/nominaStores';
	import { createEventDispatcher } from 'svelte';
	import Spinner from 'svelte-spinner';
	import { validateAllNomina, validateAllLicencia } from '$lib/helpers';

	export let components: IComponentObject;
	export let action: string;
	export let disabled: boolean = true;
	export let extraValidations: FunctionsObject | boolean = false;

	let dispacher = createEventDispatcher();

	let loading = false;
	let error = { message: [], status: false };
	const handlerSubmit = async (e: Event) => {
		if (loading) return;
		error = { message: [], status: false };
		loading = true;
		let formData = new FormData();
		try {
			const response: any = components.datosPersonales
				? await validateAllNomina(components, extraValidations)
				: await validateAllLicencia(components, extraValidations);
			if (response.status) {
				formData = response.data;
			} else error = response.data;
			console.log('formData: ', formData);
			console.log('error: ', error);

			if (error.status) return;
			if ($agenteStore.id) formData.append('id', $agenteStore.id);
			const res = await fetch(`?/${action}`, {
				method: 'POST',
				body: formData
			});
			if (res.status == 400) {
				dispacher('invalid', {
					data: (await res.json()).error.message
				});
			} else {
				dispacher('valid');
			}
		} catch (err) {
			console.log('ERORR', err);
		} finally {
			loading = false;
		}
	};
</script>

<form
	class="flex justify-center flex-col w-full items-center"
	on:submit|preventDefault={handlerSubmit}
>
	<slot />
	<button
		type="submit"
		class="w-5/6 mt-5 p-2 text-sm font-semibold rounded-md flex gap-2 justify-center items-center bg-lime-500 hover:bg-lime-600 hover:cursor-pointer"
		class:disabled
		value="Agregar agente"
		{disabled}
	>
		{#if loading}
			<Spinner class="text-stone-900" />
		{:else}
			Cargar datos
		{/if}
	</button>
</form>
{#if error.status}
	<div class="mt-5">
		<p class="mb-1">Ocurrieron los Siguientes errores:</p>
		<ul class="list-disc">
			{#each error.message as message}
				<li>
					{message}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style lang="postcss">
	.disabled {
		@apply bg-lime-300 cursor-not-allowed;
	}
</style>
