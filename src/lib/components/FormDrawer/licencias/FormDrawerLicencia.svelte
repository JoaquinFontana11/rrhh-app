<script lang="ts">
	import { Icon, ChevronDown, ExclamationCircle } from 'svelte-hero-icons';
	import type { IComponentObject } from '$lib/types';
	import FormDrawer from '../FormDrawer.svelte';
	import FormDrawerInputGroup from '../FormDrawerInputGroup.svelte';
	import { validateEmptyInput } from '../validators';

	export let props: any;

	let agentes = props.drawerContentProps || [];
	let showErrors: boolean = false;
	let errorsMessage: { error: string; description: string }[] = [];

	let licencia = {
		agente: 0,
		tipo: '',
		fechaInicio: '',
		fechaFin: '',
		observaciones: '',
		autorizadoSiape: ''
	};

	let components: IComponentObject = {};
	$: components = {
		datosGenerales: [
			{
				type: 'select',
				label: 'agente',
				name: 'agente',
				value: licencia.agente * 1,
				validators: [validateEmptyInput],
				options: agentes.map((agente) => {
					return { name: agente.emailPersonal, value: agente.id };
				})
			},
			{
				type: 'date',
				label: 'fecha de inicio',
				name: 'fechaInicio',
				value: licencia.fechaInicio,
				required: true,
				validators: [
					validateEmptyInput,
					(value: any) => {
						if (new Date(value).getTime() > new Date(licencia.fechaFin).getTime())
							return {
								message: 'La fecha de inicio debe ser igual o anterior a la fecha de fin',
								status: false
							};
					}
				]
			},
			{
				type: 'date',
				label: 'fecha de fin',
				name: 'fechaFin',
				value: licencia.fechaFin,
				required: true,
				validators: [
					validateEmptyInput,
					(value) => {
						if (new Date(value).getTime() < new Date(licencia.fechaInicio).getTime())
							return {
								message: 'La fecha de inicio debe ser igual o anterior a la fecha de fin',
								status: false
							};
					}
				]
			},
			{
				type: 'text',
				label: 'observaciones',
				name: 'observaciones',
				value: licencia.observaciones,
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'autorizado por Siape',
				name: 'autorizadoSiape',
				value: licencia.autorizadoSiape == 'true',
				required: false,
				validators: [validateEmptyInput],
				options: [
					{ value: false, name: 'No' },
					{ value: true, name: 'Si' }
				]
			},
			{
				type: 'select',
				label: 'tipo',
				name: 'tipo',
				value: licencia.tipo,
				required: true,
				validators: [validateEmptyInput],
				options: [
					{ value: 'ausente', name: 'ausente con aviso' },
					{ value: 'academica', name: 'academica' },
					{ value: 'salud', name: 'salud' },
					{ value: 'teletrabajo', name: 'teletrabajo' },
					{ value: 'vacaciones', name: 'vacaciones' },
					{ value: 'otro', name: 'otro' }
				]
			}
		],
		vacaciones: [
			{
				type: 'select',
				label: 'periodo',
				name: 'periodo',
				value: '',
				required: true,
				validators: [validateEmptyInput],
				options: [
					{ value: 1, name: 'primero' },
					{ value: 2, name: 'segundo' }
				]
			}
		],
		ausente: [],
		salud: [
			{
				type: 'text',
				label: 'concepto',
				name: 'concepto',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			}
		],
		academica: [
			{
				type: 'select',
				label: 'ultima materia',
				name: 'ultimaMateria',
				value: '',
				required: true,
				validators: [validateEmptyInput],
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			}
		],
		teletrabajo: [
			{
				type: 'select',
				label: 'mail autorizado',
				name: 'mailAutorizado',
				value: '',
				required: true,
				validators: [validateEmptyInput],
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			},
			{
				type: 'select',
				label: 'comunicacion inicio',
				name: 'comunicacionInicio',
				value: '',
				required: true,
				validators: [validateEmptyInput],
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			},
			{
				type: 'select',
				label: 'comunicacion fin',
				name: 'comunicacionFin',
				value: '',
				required: true,
				validators: [validateEmptyInput],
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			},
			{
				type: 'select',
				label: 'comunico inicio a',
				name: 'comunicoInicioA',
				value: '',
				validators: [validateEmptyInput],
				options: agentes.map((agente) => {
					return { name: agente.emailPersonal, value: agente.id };
				})
			},
			{
				type: 'select',
				label: 'comunico fin a',
				name: 'comunicoFinA',
				value: '',
				validators: [validateEmptyInput],
				options: agentes.map((agente) => {
					return { name: agente.emailPersonal, value: agente.id };
				})
			},
			{
				type: 'select',
				label: 'conectado a teams',
				name: 'conectadoATeams',
				value: '',
				required: true,
				validators: [validateEmptyInput],
				options: [
					{ value: true, name: 'Si' },
					{ value: false, name: 'No' }
				]
			}
		]
	};

	const changeInputsGenerales = (e: Event) => {
		const target = e.target as HTMLInputElement;
		licencia[target.name] = target.value;
	};

	const showValidations = (e: CustomEvent) => {
		const dataErrors = JSON.parse(e.detail.data);

		console.log(dataErrors);

		showErrors = true;
		errorsMessage = [];
		// TODO: invertir el orden de los mensjes
		Object.entries(dataErrors.flags).forEach((flag) => {
			if (flag[1]) return;
			errorsMessage.push(dataErrors.messages[flag[0]]);
		});
	};
</script>

{JSON.stringify(licencia)}
<div class="p-2 flex flex-col items-center w-full scrollbar-thin scrollbar-w-10 overflow-y-scroll">
	<!--
	<div class="flex m-2 relative">

			<label class=" block  mr-8 text-sm font-medium text-stone-900 dark:text-stone-400 w-2/4"
			>seleccione un agente
		</label>
		
		<select
		bind:value={agenteId}
		class="outline-none col-span-4 col-start-3 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stone-800 focus:border-stone-800 block w-full p-1 dark:bg-stone-800 dark:text-stone-500 dark:focus:text-stone-200  dark:border-stone-600 dark:focus:border-stone-500 "
		>
		{#each agentes as agente}
		<option value={agente.id}>{agente.emailPersonal}</option>
		{/each}
	</select>
</div>
-->
	<div class=" flex w-full justify-center mt-4 mb-4 dark:text-stone-400">
		<span> datos generales de la licencia</span>
		<div class="flex gap-1 justify-center items-center">
			<Icon src={ChevronDown} class="pl-2 w-7 h-7  " />
		</div>
	</div>
	<!--

		{#if agenteId}
	-->
	<FormDrawer
		{components}
		action="create"
		disabled={false}
		on:invalid={showValidations}
		on:valid={() => {
			showErrors = false;
		}}
	>
		<FormDrawerInputGroup
			bind:components={components.datosGenerales}
			formName="datosGenerales"
			on:input={changeInputsGenerales}
			validateAllInputs={false}
		/>
		{#if licencia.tipo && licencia.tipo !== 'otro' && licencia.tipo !== 'ausente'}
			<div class=" flex w-full justify-center mt-4 mb-4 dark:text-stone-400">
				<span> datos especificos de la licencia</span>
				<div class="flex gap-1 justify-center items-center">
					<Icon src={ChevronDown} class="pl-2 w-7 h-7  " />
				</div>
			</div>
			<FormDrawerInputGroup bind:components={components[licencia.tipo]} formName={licencia.tipo} />
		{/if}
	</FormDrawer>
	{#if showErrors}
		<div class=" w-full p-3 m-5 flex flex-col gap-5">
			{#each errorsMessage as error}
				<div
					class="flex bg-white shadow-md p-2 justify-arround items-center gap-2 rounded-lg dark:bg-stone-800 dark:border dark:border-stone-700"
				>
					<Icon src={ExclamationCircle} class="text-rose-500 w-6 h-6" />
					<div class="w-5/6">
						<p class="text-stone-700 dark:text-stone-200 text-sm">{error.error}</p>
						<p class="text-stone-500 text-sm">{error.description}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<!--

			{/if}
		-->
</div>
