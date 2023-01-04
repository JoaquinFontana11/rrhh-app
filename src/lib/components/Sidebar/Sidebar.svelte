<script lang="ts">
	import {
		Icon,
		ChevronDoubleRight,
		Adjustments,
		Archive,
		Bookmark,
		Calendar,
		Chip,
		Table
	} from 'svelte-hero-icons';
	import SidebarButton from './SidebarButton.svelte';
	import SidebarButtonTheme from './SidebarButtonTheme.svelte';
</script>

<nav
	class="z-50 bg-white border-r border-gray-200 flex flex-col gap-10 px-4 w-14  items-center  dark:bg-stone-900 dark:border-stone-800"
>
	<Icon src={Chip} class="w-8 h-8 text-lime-500 mt-3" />
	<ul class="flex flex-col gap-4 absolute top-1/2 -translate-y-1/2">
		<SidebarButton icon={Table} tooltip="Nomina de agentes" href="/nomina" />
	</ul>
	<ul class="absolute bottom-2 flex flex-col gap-3">
		<!--

			<SidebarButton icon={ChevronDoubleRight} tooltip="La PLAYA" on:click />
		-->
		<SidebarButtonTheme />
	</ul>
</nav>
