<script lang="ts">
	import { Icon, User, Newspaper, Calendar, Document } from 'svelte-hero-icons';
</script>

<div class="flex flex-col gap-10 justify-center items-center w-full h-full">
	<div>
		<h1 class="text-center text-4xl font-bold dark:text-stone-200">
			Bienvenidx al portal de administracion de RRHH!
		</h1>
		<p class="text-center text-lg font-medium text-stone-700 dark:text-stone-400">
			Seleccione uno de los siguientes modulos para comenzar a trabajar!
		</p>
	</div>
	<div class="flex gap-10 md:grid md:grid-cols-2">
		<a
			href="/nomina"
			class="p-5 shadow-lg rounded-md w-72 flex flex-col items-center gap-2 dark:shadow-none dark:border dark:border-stone-600 hover:-translate-y-1 hover:shadow-xl duration-75 dark:hover:bg-stone-800"
		>
			<Icon src={User} class="w-8 h-8 text-lime-500" />
			<h2 class="dark:text-stone-400">Nomina</h2>
			<p class="text-center text-sm text-stone-600">
				En este modulo vas a poder administrar todos los datos de los agentes, filtrarlos y generar
				reportes
			</p>
		</a>
		<a
			href="/licencias"
			class="p-5 shadow-lg rounded-md w-72 flex flex-col items-center gap-2 dark:shadow-none dark:border dark:border-stone-600 hover:-translate-y-1 hover:shadow-xl duration-75 dark:hover:bg-stone-800"
		>
			<Icon src={Newspaper} class="w-8 h-8 text-lime-500" />
			<h2 class="dark:text-stone-400">Licencias</h2>
			<p class="text-center text-sm text-stone-600">
				En este modulo vas a poder gestionar todas las licencias de los agentes
			</p>
		</a>
		<a
			href="/notas"
			class="p-5 shadow-lg rounded-md w-72 flex flex-col items-center gap-2 dark:shadow-none dark:border dark:border-stone-600 hover:-translate-y-1 hover:shadow-xl duration-75 dark:hover:bg-stone-800"
		>
			<Icon src={Document} class="w-8 h-8 text-lime-500" />
			<h2 class="dark:text-stone-400">Notas</h2>
			<p class="text-center text-sm text-stone-600">
				En este modulo podras agregar notas para que otros miembros del equipo las vean
			</p>
		</a>
		<a
			href="/calendario"
			class="p-5 shadow-lg rounded-md w-72 flex flex-col items-center gap-2 dark:shadow-none dark:border dark:border-stone-600 hover:-translate-y-1 hover:shadow-xl duration-75 dark:hover:bg-stone-800"
		>
			<Icon src={Calendar} class="w-8 h-8 text-lime-500" />
			<h2 class="dark:text-stone-400">Calendario</h2>
			<p class="text-center text-sm text-stone-600">
				Con el calendario podes ver las licencias de una forma mucho mas grafica
			</p>
		</a>
	</div>
</div>
