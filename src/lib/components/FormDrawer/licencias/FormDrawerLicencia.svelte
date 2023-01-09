<script lang="ts">
	import { Icon, ChevronDown } from 'svelte-hero-icons';
	import type { IComponentObject } from '$lib/types';
	import FormDrawer from '../FormDrawer.svelte';
	import FormDrawerInputGroup from '../FormDrawerInputGroup.svelte';
	import { validateEmptyInput } from '../validators';
	import { supabase } from '$lib/supabaseClient';

	let agentes: any = [];
	let agenteId: number;
	let tipoLicencia: string = '';

	let components: IComponentObject = {
		datosGenerales: [
			{
				type: 'date',
				label: 'fecha de inicio',
				name: 'fechaInicio',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'date',
				label: 'fecha de fin',
				name: 'fechaFin',
				value: '',
				required: true,
				validators: [validateEmptyInput]
			},
			{
				type: 'text',
				label: 'observaciones',
				name: 'observaciones',
				value: '',
				required: false,
				validators: [validateEmptyInput]
			},
			{
				type: 'select',
				label: 'autorizado por Siape',
				name: 'aultorizadoSiape',
				value: '',
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
				value: tipoLicencia,
				required: true,
				validators: [validateEmptyInput],
				options: [
					{ value: 'ausente', name: 'ausente con aviso' },
					{ value: 'academica', name: 'academica' },
					{ value: 'salud', name: 'salud' },
					{ value: 'teletrabajo', name: 'teletrabajo' },
					{ value: 'vacaciones', name: 'vacaciones' }
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
		tipoLicencia = target.name == 'tipo' ? target.value : tipoLicencia;
	};

	(async () => {
		const { data } = await supabase.from('agente').select();
		agentes = data;
	})();
</script>

<div class="p-2 flex flex-col items-center w-full scrollbar-thin scrollbar-w-10 overflow-y-scroll">
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
	<div class=" flex w-full justify-center mt-4 mb-4 dark:text-stone-400">
		<span> datos generales de la licencia</span>
		<div class="flex gap-1 justify-center items-center">
			<Icon src={ChevronDown} class="pl-2 w-7 h-7  " />
		</div>
	</div>
	{#if agenteId}
		<FormDrawer {components} action="create" disabled={true}>
			<FormDrawerInputGroup
				bind:components={components.datosGenerales}
				formName="datosGenerales"
				on:input={changeInputsGenerales}
			/>
			{#if tipoLicencia}
				<div class=" flex w-full justify-center mt-4 mb-4 dark:text-stone-400">
					<span> datos especificos de la licencia</span>
					<div class="flex gap-1 justify-center items-center">
						<Icon src={ChevronDown} class="pl-2 w-7 h-7  " />
					</div>
				</div>
				<FormDrawerInputGroup bind:components={components[tipoLicencia]} formName={tipoLicencia} />
			{/if}
		</FormDrawer>
	{/if}
</div>
