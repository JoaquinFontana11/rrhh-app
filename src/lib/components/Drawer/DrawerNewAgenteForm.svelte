<script lang="ts">
	import { Icon, ChevronDown } from 'svelte-hero-icons';
	import FormInputText from '../Inputs/FormInputText.svelte';
	import FormInputDate from '../Inputs/FormInputDate.svelte';
	import FormInputNumber from '../Inputs/FormInputNumber.svelte';
	import FormInputSelect from '../Inputs/FormInputSelect.svelte';
	import FormInputEmail from '../Inputs/FormInputEmail.svelte';
	import FormChild from '../FormChild.svelte';
	import type { datosPersonalesType, IComponent } from '$lib/types';

	let dropdownDatosPersonales: boolean = false;
	let validate: boolean = true;
	const components: IComponent[] = [
		{
			type: 'number',
			label: 'DNI',
			name: 'DNI',
			value: ''
		},
		{
			type: 'number',
			label: 'CUIT',
			name: 'CUIT',
			value: ''
		},
		{
			type: 'date',
			label: 'Fecha de nacimiento',
			name: 'birth',
			value: ''
		},
		{
			type: 'text',
			label: 'domicilio',
			name: 'home',
			value: ''
		},
		{
			type: 'email',
			label: 'email personal',
			name: 'private email',
			value: ''
		},
		{
			type: 'email',
			label: 'email institucional',
			name: 'work email',
			value: ''
		},
		{
			type: 'number',
			label: 'telefono',
			name: 'telephone',
			value: ''
		},
		{
			type: ' text',
			label: 'categoria',
			name: 'category',
			value: ''
		},
		{
			type: 'text',
			label: 'curriculum',
			name: 'CV',
			value: ''
		},
		{
			type: 'text',
			label: 'agrupamiento',
			name: 'grouping',
			value: ''
		},
		{
			type: 'text',
			label: 'genero',
			name: 'gender',
			value: ''
		},
		{
			type: 'select',
			label: 'Activo',
			name: 'active',
			value: '',
			required: true,
			options: [
				{ value: true, name: 'SI' },
				{ value: false, name: 'No' }
			]
		}
	];
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

	const validators = (data: any) => {
		return false;
	};

	const validateForm = async (e: CustomEvent) => {
		validate = e.detail;
		console.log(validate);
	};
	console.log(validate);
</script>

<div class="p-2 flex flex-col items-center w-[85.5%]">
	<button
		id="dropdownDatosPersonales"
		data-dropdown-toggle="dropdownDatosPersonales"
		class={'text-stone-700 bg-white hover:bg-stone-100 focus:outline-none font-medium rounded-lg text-xs px-6 py-1.5 text-center inline-flex items-center dark:bg-stone-700 dark:hover:bg-stone-800 border-2 border-stone-700 dark:text-black dark:border-black'}
		class:invalid={!validate}
		on:click={() => {
			dropdownDatosPersonales = !dropdownDatosPersonales;
		}}
		>Datos Personales
		<Icon src={ChevronDown} class="pl-2 w-6 h-6" />
	</button>
	{#if dropdownDatosPersonales}
		<div class=" w-full bg-white rounded-lg divide-y divide-gray-100 shadow dark:bg-gray-700">
			<FormChild {components} action="create" {validators} on:destroy={validateForm} />
			<!-- <form
				class="py-1 text-sm text-gray-700 dark:text-gray-200 flex flex-col justify-center items-center"
			>
				<div class="w-[90%] h-[50%]">
					<FormInputNumber label="DNI" bind:value={datosPersonales.DNI} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputNumber label="CUIT" bind:value={datosPersonales.CUIT} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputDate
						label="Fecha de nacimiento"
						bind:value={datosPersonales.fechaNacimiento}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputText label="domicilio" bind:value={datosPersonales.domicilio} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputEmail
						label="emailPersonal"
						bind:value={datosPersonales.emailPersonal}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputEmail
						label="emailInstitucional"
						bind:value={datosPersonales.emailInstitucional}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputNumber label="telefono" bind:value={datosPersonales.telefono} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputText label="categoria" bind:value={datosPersonales.categoria} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputText
						label="curriculum"
						bind:value={datosPersonales.curriculum}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputText
						label="agrupamiento"
						bind:value={datosPersonales.agrupamiento}
						required={true}
					/>
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputText label="genero" bind:value={datosPersonales.genero} required={true} />
				</div>
				<div class="w-[90%] h-[50%]">
					<FormInputSelect
						label="activo"
						bind:value={datosPersonales.activo}
						required={true}
						options={[
							{ value: true, name: 'Activo' },
							{ value: false, name: 'Inactivo' }
						]}
					/>
				</div>
			</form> -->
		</div>
	{/if}
</div>

<style lang="postcss">
	.invalid {
		@apply border-red-800 text-red-800;
	}
</style>
