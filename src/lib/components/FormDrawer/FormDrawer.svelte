<script lang="ts">
	import type { FunctionsObject, IComponentObject, ErrorsArray, ErrorObject } from '$lib/types';
	import { agenteStore } from '$lib/stores/nominaStores';
	import { LicenciaStore } from '$lib/stores/licenciaStore';
	import { createEventDispatcher } from 'svelte';
	import Spinner from 'svelte-spinner';
	import { validateAllNomina, validateAllLicencia } from '$lib/helpers';
	export let components: IComponentObject;
	export let action: string;
	export let disabled: boolean = true;
	export let extraValidations: FunctionsObject | boolean = false;

	let dispatcher = createEventDispatcher();

	let loading = false;
	let error: ErrorsArray = { message: [], status: false };

	const handlerSubmit = async (e: Event) => {
		if (loading) return;
		console.log('aaaa');
		error = { message: [], status: false };
		loading = true;
		let formData = new FormData();
		try {
			const response: any = components.datosPersonales
				? await validateAllNomina(components, extraValidations, action)
				: await validateAllLicencia(components, extraValidations, action);
			if (response.status) {
				formData = response.data;
			} else error = response.data;

			if (error.status) {
				return dispatcher('error', { message: error.message });
			}
			if ($agenteStore.id) formData.append('id', $agenteStore.id);
			if ($LicenciaStore.id) formData.append('id', $LicenciaStore.id);
			const res = await fetch(`?/${action}`, {
				method: 'POST',
				body: formData
			});
			if (res.status == 400) {
				const message = (await res.json()).error.message;

				dispatcher('error', { message: message });
			} else {
				dispatcher('valid');
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
		class="w-5/6 mt-5 p-2 text-sm font-semibold rounded-md flex gap-2 justify-center items-center bg-DPMA-Rose hover:bg-dark-Rose hover:cursor-pointer"
		class:disabled
		{disabled}
	>
		{#if loading}
			<Spinner class="text-stone-900" />
		{:else}
			Cargar datos
		{/if}
	</button>
</form>

<!-- {#if error.status}
	<div class=" w-full p-3 m-5 flex flex-col gap-5">
		{#each error.message as message}
			<div
				class="flex bg-white shadow-md p-2 justify-arround items-center gap-2 rounded-lg dark:bg-stone-800 dark:border dark:border-stone-700"
			>
				<Icon src={ExclamationCircle} class="text-rose-500 w-6 h-6" />
				<div class="w-5/6">
					<p class="text-stone-700 dark:text-stone-200 text-sm">{message.error}</p>
					<p class="text-stone-500 text-sm">{message.description}</p>
				</div>
			</div>
		{/each}
	</div>
{/if} -->
<style lang="postcss">
	.disabled {
		@apply bg-light-Rose cursor-not-allowed;
	}
</style>
