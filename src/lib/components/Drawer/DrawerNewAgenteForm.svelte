<script lang="ts">
	import { stringify } from 'postcss';
	import { Icon, ChevronDown } from 'svelte-hero-icons';
	import FromInputText from '../Inputs/FromInputText.svelte';
	import FormInputDate from '../Inputs/FormInputDate.svelte';
	import type { datosPersonalesType } from '$lib/types';
	let dropdownDatosPersonales: boolean = false;
	const datosPersonales: datosPersonalesType = {
		DNI: null,
		CUIT: null,
		fechaNacimiento: null,
		domicilio: null,
		emailPersonal: null,
		emailInstitucional: null,
		telefono: null,
		categoria: null,
		curriculum: null,
		agrupamiento: null,
		genero: null,
		activo: true
	};
</script>

<div class="p-2 flex flex-col items-center w-[85.5%]">
	<button
		id="dropdownDatosPersonales"
		data-dropdown-toggle="dropdownDatosPersonales"
		class="text-white bg-stone-700 hover:bg-stone-800 focus:outline-none font-medium rounded-lg text-xs px-6 py-1.5 text-center inline-flex items-center dark:bg-stone-600 dark:hover:bg-stone-700"
		type="button"
		on:click={() => {
			dropdownDatosPersonales = !dropdownDatosPersonales;
		}}
		>Datos Personales
		<Icon src={ChevronDown} class="pl-2 w-6 h-6" />
	</button>
	{#if dropdownDatosPersonales}
		<div
			id="dropdownDatosPersonales"
			class=" w-full bg-white rounded-lg divide-y divide-gray-100 shadow dark:bg-gray-700"
		>
			<form
				class="py-1 text-sm text-gray-700 dark:text-gray-200 flex flex-col justify-centerv items-center"
				aria-labelledby="dropdownDatosPersonales"
			>
				<div class="w-[90%] h-[50%]">
					<FromInputText label="DNI" bind:value={datosPersonales.DNI} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText label="CUIT" bind:value={datosPersonales.CUIT} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputDate
						label="Fecha de nacimiento"
						bind:value={datosPersonales.fechaNacimiento}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText label="domicilio" bind:value={datosPersonales.domicilio} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText
						label="emailPersonal"
						bind:value={datosPersonales.emailPersonal}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText
						label="emailInstitucional"
						bind:value={datosPersonales.emailInstitucional}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText label="telefono" bind:value={datosPersonales.telefono} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText label="categoria" bind:value={datosPersonales.categoria} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText
						label="curriculum"
						bind:value={datosPersonales.curriculum}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText
						label="agrupamiento"
						bind:value={datosPersonales.agrupamiento}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText label="genero" bind:value={datosPersonales.genero} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FromInputText label="activo" bind:value={datosPersonales.activo} required={true} />
				</div>
			</form>
		</div>
	{/if}
</div>
