<script lang="ts">
	import { Icon, ChevronDown, ExclamationCircle } from 'svelte-hero-icons';
	import type { IComponentObject } from '$lib/types';
	import FormDrawer from '../FormDrawer.svelte';
	import FormDrawerInputGroup from '../FormDrawerInputGroup.svelte';
	import FormDrawerInputGroupButton from '../FormDrawerInputGroupButton.svelte';
	import { validateEmptyInput } from '../validators';
	import { diffDays } from '$lib/helpers';

	export let props: any;

	let agentes = props.drawerContentProps || [];
	let showErrors: boolean = false;
	let errorsMessage: { error: string; description: string }[] = [];
	let disabledButton = true;
	let showForm = true;

	let validateForm = false;
	let validateForms = {
		datosGenerales: false,
		academica: true
	};

	let licencia = {
		agente: 1,
		tipo: '',
		fechaInicio: '',
		fechaFin: '',
		observaciones: '',
		autorizadoSiape: '',
		ultimaMateria: '',
		periodo: 1
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
					},
					(value: any) => {
						if (
							licencia.ultimaMateria == 'true' &&
							diffDays(licencia.fechaFin, licencia.fechaInicio) != 11
						)
							return {
								message:
									'Si es la ultima materia, se deben asignar 10 dias preexamen (una direfencia de 10 dias entre la fecha de inicio y la de fin)',
								status: false
							};
					},
					(value: any) => {
						if (licencia.tipo == 'ausente' && licencia.fechaFin !== licencia.fechaInicio)
							return {
								message:
									'Si el tipo de licencia es ausente con aviso, la fecha de fin y de inicio debe ser la misma',
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
					},
					(value: any) => {
						if (
							licencia.ultimaMateria == 'true' &&
							diffDays(licencia.fechaFin, licencia.fechaInicio) != 11
						)
							return {
								message:
									'Si es la ultima materia, se deben asignar 10 dias preexamen (una direfencia de 10 dias entre la fecha de inicio y la de fin)',
								status: false
							};
					},
					(value: any) => {
						if (licencia.tipo == 'ausente' && licencia.fechaFin !== licencia.fechaInicio)
							return {
								message:
									'Si el tipo de licencia es ausente con aviso, la fecha de fin y de inicio debe ser la misma',
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
				validators: []
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
				value: licencia.periodo,
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
				value: licencia.ultimaMateria == 'true',
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

		showErrors = true;
		errorsMessage = [];
		// TODO: invertir el orden de los mensjes
		Object.entries(dataErrors.flags).forEach((flag) => {
			if (flag[1]) return;
			errorsMessage.push(dataErrors.messages[flag[0]]);
		});
	};

	const runValidators = (e: CustomEvent) => {
		validateForms[e.detail.form] = e.detail.status;
		disabledButton = true ? !(validateForms.datosGenerales && validateForms.academica) : false;
		validateForm = !disabledButton;
	};
</script>

<div class="p-2 flex flex-col items-center w-full scrollbar-thin scrollbar-w-10 overflow-y-scroll">
	<!--

		<div class=" flex w-full justify-center mt-4 mb-4 dark:text-stone-400">
			<span> datos generales de la licencia</span>
			<div class="flex gap-1 justify-center items-center">
				<Icon src={ChevronDown} class="pl-2 w-7 h-7  " />
			</div>
		</div>
	-->

	<FormDrawer
		{components}
		action="create"
		disabled={disabledButton || showForm}
		on:invalid={showValidations}
		on:valid={() => {
			showErrors = false;
		}}
		><FormDrawerInputGroupButton
			on:click={() => {
				showForm = !showForm;
			}}
			label="Datos generales de la licencia"
			validate={validateForm}
		/>
		{#if showForm}
			<FormDrawerInputGroup
				bind:components={components.datosGenerales}
				formName="datosGenerales"
				on:input={changeInputsGenerales}
				validateAllInputs={true}
				on:destroy={runValidators}
			/>
			{#if licencia.tipo && licencia.tipo !== 'otro' && licencia.tipo !== 'ausente'}
				<div class=" flex w-full justify-center mt-4 mb-4 dark:text-stone-400">
					<span> datos especificos de la licencia</span>
					<div class="flex gap-1 justify-center items-center">
						<Icon src={ChevronDown} class="pl-2 w-7 h-7  " />
					</div>
				</div>
				<FormDrawerInputGroup
					bind:components={components[licencia.tipo]}
					formName={licencia.tipo}
					on:input={changeInputsGenerales}
					validateAllInputs={true}
					on:destroy={runValidators}
				/>
			{/if}
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
</div>
<!--

	{#each formNames as formName}
	<FormDrawerInputGroupButton
				on:click={() => {
					dropdown[formName] = !dropdown[formName];
				}}
				label={labels[formName]}
				validate={validate[formName]}
				/>
				{#if dropdown[formName]}
				<div class=" w-auto divide-y divide-gray-100  dark:bg-stone-900 mt-3" transition:fly>
					<FormDrawerInputGroup
						bind:components={components[formName]}
						on:destroy={validateForm}
						on:input={changeInput}
						{formName}
						validateAllInputs={!validate[formName]}
						/>
					</div>
			{/if}
		{/each}

				-->
