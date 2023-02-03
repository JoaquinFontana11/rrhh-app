<script lang="ts">
	import { Plus } from 'svelte-hero-icons';
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardToolbarNote from '$lib/components/Dashboard/Notes/DashboardToolbarNote.svelte';
	import DashboardNotes from '$lib/components/Dashboard/Notes/DashboardNotes.svelte';
	import type { PageData } from './$types';
	import type { Nota } from '$lib/types';

	export let data: PageData;
	let modulo = '/nomina';

	let notesData: Nota[] = data.data as Nota[];
	let notes: Nota[] = notesData.filter((note) => note.modulo == modulo);

	let showDropdown = false;
	const addNote = (e: CustomEvent) => {
		data.data?.push(e.detail.note);
		notes = notesData.filter((note) => note.modulo == modulo);
	};

	const filterNotes = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		modulo = target.value;
		notes = notesData.filter((note) => note.modulo == modulo);
	};

	const deleteNote = (e: CustomEvent) => {
		notesData = notesData.filter((note) => note.id !== e.detail.id);
		notesData = notesData.filter((note) => note.modulo == modulo);
	};

	const refreshNotes = async (e: CustomEvent) => {
		data.data = await data.reload();
		notesData = data.data as Nota[];
		notes = notesData.filter((note) => note.modulo == modulo);
	};
</script>

<Header />
<Dashboard>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarSelect
			options={[
				{ name: 'nomina', value: '/nomina' },
				{ name: 'licencias', value: '/licencias' }
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
		on:delete-note={deleteNote}
		on:refresh={refreshNotes}
	/>
</Dashboard>
