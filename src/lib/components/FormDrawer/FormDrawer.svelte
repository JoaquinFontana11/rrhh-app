<script lang="ts">
	import type { FunctionsObject, IComponentObject } from '$lib/types';
	import { agenteStore } from '$lib/stores/agenteStore';
	import Spinner from 'svelte-spinner';

	export let components: IComponentObject;
	export let action: string;
	export let disabled: boolean = true;
	export let extraValidations: FunctionsObject;

	let loading = false;
	let error = { message: [], status: false };
	const handlerSubmit = async (e: Event) => {
		if (loading) return;
		loading = true;
		const formData = new FormData();
		try {
			for (const key in components) {
				let resExtraValidations;
				for (const component of components[key]) {
					let res;
					let status: boolean = true;
					component.validators.forEach((validator) => {
						res = component.required ? validator(component.value) : null;
						if (res && res.message) error.message.push(res.message);
						error.status = res && !res.status ? res.status : status;
					});
					if (!status) return;
				}
				console.log(key);
				console.log(extraValidations[key]);
				resExtraValidations = extraValidations[key]
					? extraValidations[key](components[key])
					: { status: false };
				if (resExtraValidations.status) {
					error.message.push(resExtraValidations.message);
					error.status = resExtraValidations.status;
					return;
				}
				await Promise.all(
					components[key].map((component) => {
						formData.append(component.name, component.value);
					})
				);
			}
			if ($agenteStore.id) formData.append('id', $agenteStore.id);
			// await fetch(`?/${action}`, {
			// 	method: 'POST',
			// 	body: formData
			// });
		} catch (err) {
			console.log(err);
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
