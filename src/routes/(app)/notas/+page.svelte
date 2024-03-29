<script lang="ts">
	import { Plus } from 'svelte-hero-icons';
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardToolbarNote from '$lib/components/Dashboard/Notes/DashboardToolbarNote.svelte';
	import DashboardNotes from '$lib/components/Dashboard/Notes/DashboardNotes.svelte';
	import type { PageData } from './$types';
	import type { Nota, Usuario } from '$lib/types';
	import { init } from 'svelte/internal';

	export let data: PageData;

	let intervalID: number = 0;
	let modulo = '/nomina';

	let notesData: Nota[] = data.data as Nota[];
	let notes: Nota[] = notesData.filter((note) => note.modulo == modulo);

	let allUsers: Usuario[] = data.allUsers as Usuario[];

	let showDropdown = false;

	const initLongPolling = () => {
		if (!intervalID) intervalID = setInterval(refreshNotes, 10000);
	};

	const stopLongPolling = () => {
		if (intervalID) {
			clearInterval(intervalID);
			intervalID = 0;
		}
	};

	const addNote = (e: CustomEvent) => {
		stopLongPolling();
		data.data?.push(e.detail.note);
		notes = notesData.filter((note) => note.modulo == modulo);
		initLongPolling();
	};

	const filterNotes = (e: Event) => {
		stopLongPolling();
		const target = e.target as HTMLSelectElement;
		modulo = target.value;
		notes = notesData.filter((note) => note.modulo == modulo);
		initLongPolling();
	};

	const deleteNote = (e: CustomEvent) => {
		stopLongPolling();
		notesData = notesData.filter((note) => note.id !== e.detail.id);
		notesData = notesData.filter((note) => note.modulo == modulo);
		initLongPolling();
	};

	const refreshNotes = async (e: CustomEvent) => {
		data.data = await data.reload();
		notesData = data.data as Nota[];
		notes = notesData.filter((note) => note.modulo == modulo);
	};

	initLongPolling();
</script>

<Header />
<Dashboard>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarSelect
			options={[
				{ name: 'nomina', value: '/nomina' },
				{ name: 'licencias', value: '/licencias' },
				{ name: 'calendario', value: '/calendario' }
			]}
			value="/nomina"
			on:input={filterNotes}
		/>
		<DashboardToolbarButton
			name="Agregar nota"
			icon={Plus}
			highlight={true}
			dropdown={true}
			bind:showDropdown
			on:click={() => {
				showDropdown = !showDropdown;
			}}
		>
			<DashboardToolbarNote slot="dropdown-content" on:create-note={addNote} />
		</DashboardToolbarButton>
	</div>
	<DashboardNotes
		slot="dashboard-content"
		bind:notes
		{allUsers}
		on:delete-note={deleteNote}
		on:refresh={refreshNotes}
		on:stopLong={() => {
			stopLongPolling();
		}}
		on:initLong={() => {
			initLongPolling();
		}}
	/>
</Dashboard>
