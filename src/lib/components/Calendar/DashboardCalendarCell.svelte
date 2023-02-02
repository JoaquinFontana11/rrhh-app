<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { createEventDispatcher } from 'svelte';
	import DashboardCalendarCellItem from './DashboardCalendarCellItem.svelte';
	export let tipoLicencia: string;
	export let day: number | string;
	export let month: number;
	export let year: number;
	export let items: { color: string; content: string }[] = [];

	const dispatch = createEventDispatcher();

	const colors: { [key: string]: string } = {
		ausente: 'yellow',
		salud: 'green',
		vacaciones: 'orange',
		otro: 'red',
		academica: 'indigo',
		teletrabajo: 'sky'
	};
	const clickItem = async (e: CustomEvent, i: number) => {
		const currentDate = `${year}-${month + 1 > 10 ? `0${month + 1}` : month + 1}-${day}`;
		let resSupabaseItems;
		if (tipoLicencia == 'todas')
			resSupabaseItems = await supabase
				.from('licencia')
				.select('agente(*), fechaInicio, fechaFin, tipo')
				.lte('fechaInicio', currentDate)
				.gte('fechaFin', currentDate);
		else
			resSupabaseItems = await supabase
				.from('licencia')
				.select('agente(*), fechaInicio, fechaFin, tipo')
				.lte('fechaInicio', currentDate)
				.gte('fechaFin', currentDate)
				.eq('tipo', tipoLicencia);

		if (resSupabaseItems.data) {
			dispatch('show-agentes', {
				agentes: resSupabaseItems.data.map((licencia) => {
					return {
						agente: licencia.agente.nombreCompleto,
						tipo: licencia.tipo,
						color: colors[licencia.tipo]
					};
				}),
				day: day
			});
		}
	};
</script>

<div
	class="w-full h-full flex justify-center items-center relative overflow-y-scroll scrollbar-none"
>
	<span class="absolute top-3 left-3 text-stone-500 dark:text-stone-600 z-40"> {day}</span>
	<div class="flex flex-col absolute top-10 left-4 w-full">
		{#each items as item, i}
			<div class="relative">
				<DashboardCalendarCellItem
					color={item.color}
					content={item.content}
					on:click-item={(e) => {
						clickItem(e, i);
					}}
				/>
				<!--

					{#if showI == i}
					<div class=" z-50 mb-1 mr-auto w-5/6 bg-white p-3 shadow-xl rounded-lg ">
						{#each agenteList as agente}
						<p class="font-light text-sm">
							{agente}
						</p>
						{/each}
					</div>
					{/if}
				-->
			</div>
		{/each}
	</div>
</div>
