<script lang="ts">
	import type { IComponentObject } from '$lib/types';
	export let components: IComponentObject;
	const handlerSubmit = async (e: Event) => {
		const formData = new FormData();
		console.log(components);
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
	};
</script>

<form
	class="flex justify-center flex-col w-full items-center"
	on:submit|preventDefault={handlerSubmit}
>
	<slot />
	<button
		class="w-[80%] mt-5 p-2 text-sm font-semibold rounded-md flex gap-2 justify-center items-center bg-lime-500 hover:bg-lime-600"
		>Confirmar</button
	>
</form>
