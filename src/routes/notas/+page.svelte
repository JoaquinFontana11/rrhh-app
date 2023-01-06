<script lang="ts">
	import { Icon, Plus } from 'svelte-hero-icons';
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import DashboardToolbarButton from '$lib/components/Dashboard/DashboardToolbarButton.svelte';
	import DashboardToolbarNote from '$lib/components/Dashboard/Notes/DashboardToolbarNote.svelte';
	import DashboardNotes from '$lib/components/Dashboard/Notes/DashboardNotes.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let notes = data.data;

	const addNote = (e: CustomEvent) => {
		notes = [...notes, e.detail.note];
	};
</script>

<Dashboard>
	<div slot="toolbar-content" class="mr-2 h-full flex gap-2 justify-center items-center">
		<DashboardToolbarButton name="Agregar nota" icon={Plus} highlight={true} dropdown={true}>
			<DashboardToolbarNote slot="dropdown-content" on:create-note={addNote} />
		</DashboardToolbarButton>
	</div>
	<DashboardNotes slot="dashboard-content" bind:notes />
</Dashboard>
