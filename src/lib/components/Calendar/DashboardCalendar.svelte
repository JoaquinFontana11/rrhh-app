<script lang="ts">
	import DashboardCalendarCell from './DashboardCalendarCell.svelte';
	import DashboardCalendarCellItem from './DashboardCalendarCellItem.svelte';

	export let tipoLicencia: string;
	export let month: number;
	export let year: number;
	export let items: {
		[key: number]: any;
		day: {
			color: string;
			content: string;
		}[];
	};

	let monthDays: number[][];
	let firstDay: string;
	let totalDays: number;

	const daysNumeric: { [key: string]: number } = {
		lunes: 0,
		martes: 1,
		miércoles: 2,
		jueves: 3,
		viernes: 4,
		sábado: 5,
		domingo: 6
	};

	const getNumberDay = (row: number, col: number) => {
		const day = row * 7 - daysNumeric[firstDay] + col + 1;
		return day > totalDays ? 0 : day;
	};

	const loadMonthDays = (month: number) => {
		firstDay = new Date(year, month, 1)
			.toLocaleDateString('es-AR', {
				weekday: 'long',
				year: 'numeric',
				month: 'numeric',
				day: 'numeric'
			})
			.split(',')[0];

		totalDays = new Date(year, month, 0).getDate();

		monthDays = [];
		[0, 1, 2, 3, 4, 5].forEach((row) => {
			monthDays[row] = [];
			[0, 1, 2, 3, 4, 5, 6].forEach((column) => {
				monthDays[row][column] = getNumberDay(row, column);
			});
		});
		agenteDayShow = 100;
	};

	$: loadMonthDays(month);

	let agenteDayShow = 100;
	let agenteCellList: { agente: string; tipo: string; color: string }[] = [];

	const showDeails = (e: CustomEvent) => {
		if (agenteDayShow == e.detail.day) agenteDayShow = 100;
		else agenteDayShow = e.detail.day;
		agenteCellList = e.detail.agentes;
	};
</script>

<table class="w-full h-full">
	<thead class="w-full">
		<th
			class="h-8  w-[14%] bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
		>
			<p class="p-2 block overflow-auto">lunes</p>
		</th>
		<th
			class="h-8 w-[14%] bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
		>
			<p class="p-2 block overflow-auto">martes</p>
		</th><th
			class="h-8  w-[14%] bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
		>
			<p class="p-2 block overflow-auto">miercoles</p>
		</th><th
			class="h-8  w-[14%] bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
		>
			<p class="p-2 block overflow-auto">jueves</p>
		</th><th
			class="h-8  w-[14%] bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
		>
			<p class="p-2 block overflow-auto">viernes</p>
		</th><th
			class="h-8  w-[14%] bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
		>
			<p class="p-2 block overflow-auto">sabado</p>
		</th><th
			class="h-8  w-[14%] bg-stone-100 font-medium dark:bg-stone-800 dark:text-stone-300 border-l border-r dark:border-stone-700 "
		>
			<p class="p-2 block overflow-auto">domingo</p>
		</th>
	</thead>
	<tbody clasS="h-full">
		{#each [0, 1, 2, 3, 4, 5] as row}
			<tr>
				{#each [0, 1, 2, 3, 4, 5, 6] as column}
					<td class="border border-stone-200 dark:border-stone-700 relative">
						<DashboardCalendarCell
							day={monthDays[row][column] > 0 ? monthDays[row][column] : ''}
							items={items[monthDays[row][column]] ? items[monthDays[row][column]] : []}
							{month}
							{year}
							{tipoLicencia}
							on:show-agentes={showDeails}
						/>
						{#if agenteDayShow == monthDays[row][column]}
							<div
								class="absolute top-[50%] left-[50%] -translate-y-1/2 bg-white rounded-xl shadow-2xl w-full z-50 p-3  flex flex-col gap-1 dark:bg-stone-800"
								class:last_column={column == 6}
							>
								{#each agenteCellList.sort( (agente1, agente2) => (agente1.tipo > agente2.tipo ? -1 : 1) ) as agente}
									<DashboardCalendarCellItem color={agente.color} content={agente.agente} />
								{/each}
							</div>
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	.last_column {
		@apply left-0 -translate-x-[95%];
	}
</style>
