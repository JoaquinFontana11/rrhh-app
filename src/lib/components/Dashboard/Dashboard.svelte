<script lang="ts">
	import DashboardDrawer from './DashboardDrawer.svelte';
	import DashboardToolbar from './DashboardToolbar.svelte';

	export let showDrawer = false;
	export let drawerContent: any;
</script>

<div class="flex grow">
	<div class="w-0 overflow-hidden duration-500" class:drawer--show={showDrawer}>
		<DashboardDrawer
			on:click={() => {
				showDrawer = false;
			}}
		>
			<svelte:component this={drawerContent} />
		</DashboardDrawer>
	</div>
	<div class:dashboard--small={showDrawer} class="duration-500 w-full dark:border-stone-800 ">
		<DashboardToolbar>
			<slot name="toolbar-content" />
		</DashboardToolbar>
		<slot name="dashboard-content" />
		<!--

		<DashboardTable {tableData}>
			<slot name="table-extras"></slot>
			<th slot="row-extra-header" />
			<button slot="row-extra-cell">x</button>
		</DashboardTable>
	-->
	</div>
</div>

<style>
	.drawer--show {
		@apply w-56;
	}
	.dashboard--small {
		@apply border-l border-gray-200;
	}
</style>
