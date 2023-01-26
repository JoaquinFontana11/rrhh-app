<script lang="ts">
	import DashboardCalendarCell from './DashboardCalendarCell.svelte';

	export let month: number;
	export let year: number;

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
	};

	$: loadMonthDays(month);
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
					<td class="border border-stone-200 dark:border-stone-700">
						<DashboardCalendarCell day={monthDays[row][column] > 0 ? monthDays[row][column] : ''} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
