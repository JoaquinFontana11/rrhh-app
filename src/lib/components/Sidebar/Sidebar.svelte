<script lang="ts">
	import {
		Icon,
		ChevronDoubleRight,
		Adjustments,
		Archive,
		Bookmark,
		User,
		Newspaper,
		Document,
		Calendar,
		Chip,
		Table
	} from 'svelte-hero-icons';
	import SidebarButton from './SidebarButton.svelte';
	import SidebarButtonTheme from './SidebarButtonTheme.svelte';
	import SidebarButtonLogout from './SidebarButtonLogout.svelte';
</script>

<nav
	class="z-50 bg-white border-r border-gray-200 flex flex-col gap-10 px-4 w-14  items-center  dark:bg-stone-900 dark:border-stone-800"
>
	<a href="/">
		<img src="/logo-circulo.png" alt="logo de RRHH & ADM" class="mt-4 max-w-none w-10" />
	</a>
	<ul class="flex flex-col gap-4 absolute top-1/2 -translate-y-1/2">
		<SidebarButton icon={User} tooltip="Nomina de agentes" href="/nomina" />
		<SidebarButton icon={Newspaper} tooltip="Licencias" href="/licencias" />
		<SidebarButton icon={Calendar} tooltip="Calendario" href="/calendario" />
		<SidebarButton icon={Document} tooltip="Notas" href="/notas" />
	</ul>
	<ul class="absolute bottom-2 flex flex-col gap-3">
		<SidebarButtonTheme />
		<SidebarButtonLogout />
	</ul>
</nav>
