<script lang="ts">
	import type { IComponentObject } from '$lib/types';
	import { agenteStore } from '$lib/stores/agenteStore';
	import Spinner from 'svelte-spinner';

	export let components: IComponentObject;
	export let action: string;
	let loading = false;

	const handlerSubmit = async (e: Event) => {
		if (loading) return;
		loading = true;
		const formData = new FormData();
		try {
			for (const key in components) {
				await Promise.all(
					components[key].map((component) => {
						formData.append(component.name, component.value);
					})
				);
			}
			if ($agenteStore.id) formData.append('id', $agenteStore.id);
			await fetch(`?/${action}`, {
				method: 'POST',
				body: formData
			});
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
		value="Agregar agente"
	>
		{#if loading}
			<Spinner class="text-stone-900" />
		{:else}
			Cargar datos
		{/if}
	</button>
</form>
