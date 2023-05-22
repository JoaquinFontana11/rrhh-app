<script lang="ts">
	import { Sun, Moon, Icon, type IconSource } from 'svelte-hero-icons';
	let icon: IconSource = Sun;

	const cambioTema = () => {
		// guardar en local storage el tema seleccionado

		if (document.documentElement.classList.contains('dark')) {
			document.documentElement.classList.remove('dark');
			icon = Sun;
		} else {
			document.documentElement.classList.add('dark');
			icon = Moon;
		}
	};
</script>

<button
	class="w-10 h-10 rounded-lg  text-dark-Yellow hover:text-DPMA-Yellow flex justify-center items-center dark:text-gray-700 dark:hover:text-gray-500"
	on:click|preventDefault={cambioTema}
	on:keypress|preventDefault={cambioTema}
>
	<Icon src={icon} class="w-8 h-8" />
</button>
