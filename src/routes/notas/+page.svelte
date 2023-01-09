<script lang="ts">
	import { Icon, Plus } from 'svelte-hero-icons';
	import Header from '$lib/components/Header/Header.svelte';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardToolbarSelect from '$lib/components/Dashboard/DashboardToolbarSelect.svelte';
	import DashboardToolbarNote from '$lib/components/Dashboard/Notes/DashboardToolbarNote.svelte';
	import DashboardNotes from '$lib/components/Dashboard/Notes/DashboardNotes.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let modulo = '/nomina';
	let notes = data.data?.filter((note) => note.modulo == modulo);

	const addNote = (e: CustomEvent) => {
		data.data?.push(e.detail.note);
		notes = data.data?.filter((note) => note.modulo == modulo);
	};

	const filterNotes = (e: Event) => {
		modulo = e.target.value;
		notes = data.data?.filter((note) => note.modulo == modulo);
	};

	const deleteNote = (e: CustomEvent) => {
		data.data = data.data.filter((note) => note.id !== e.detail.id);
		notes = data.data?.filter((note) => note.modulo == modulo);
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
			on:input={filterNotes}
		/>
		<DashboardToolbarButton name="Agregar nota" icon={Plus} highlight={true} dropdown={true}>
			<DashboardToolbarNote slot="dropdown-content" on:create-note={addNote} />
		</DashboardToolbarButton>
	</div>
	<DashboardNotes slot="dashboard-content" bind:notes on:delete-note={deleteNote} />
</Dashboard>
