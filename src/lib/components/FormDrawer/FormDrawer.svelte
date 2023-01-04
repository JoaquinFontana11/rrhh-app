<script lang="ts">
	import type { IComponentObject } from '$lib/types';
	import { agenteStore } from '$lib/stores/agenteStore';

	export let components: IComponentObject;
	export let action: string;

	const handlerSubmit = async (e: Event) => {
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
			console.log([...formData]);
		} catch (err) {
			console.log(err);
		}
		await fetch(`?/${action}`, {
			method: 'POST',
			body: formData
		});
	};
</script>

<form
	class="flex justify-center flex-col w-full items-center"
	on:submit|preventDefault={handlerSubmit}
>
	<slot />
	<input
		type="submit"
		class="w-5/6 mt-5 p-2 text-sm font-semibold rounded-md flex gap-2 justify-center items-center bg-lime-500 hover:bg-lime-600 hover:cursor-pointer"
		value="Agregar agente"
	/>
</form>
