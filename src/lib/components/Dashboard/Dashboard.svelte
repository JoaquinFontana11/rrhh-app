<script lang="ts">
	import DashboardDrawer from './DashboardDrawer.svelte';
	import DashboardToolbar from './DashboardToolbar.svelte';

	export let showDrawer = false;
	export let drawerContent: any;
</script>

<div class="flex dashboard grow overflow-y-hidden">
	<div class="w-0  duration-500 min-w-96 overflow-auto" class:drawer--show={showDrawer}>
		<DashboardDrawer
			on:click={() => {
				showDrawer = false;
			}}
		>
			<svelte:component this={drawerContent} />
		</DashboardDrawer>
	</div>
	<div
		class:dashboard--small={showDrawer}
		class="duration-500  dark:border-stone-800 grow dashboard dashboard-content"
	>
		<DashboardToolbar>
			<slot name="toolbar-content" />
		</DashboardToolbar>
		<div
			class=" dashboard-content-table scrollbar-thin  scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-700"
		>
			<slot name="dashboard-content" />
		</div>
		<!--

		<DashboardTable {tableData}>
			<slot name="table-extras"></slot>
			<th slot="row-extra-header" />
			<button slot="row-extra-cell">x</button>
		</DashboardTable>
	-->
	</div>
</div>

<style lang="postcss">
	.drawer--show {
		@apply w-96;
	}
	.dashboard--small {
		@apply border-l;
	}
	.dashboard {
		max-width: calc(100vw - 56px);
		width: calc(100vw - 56px);
	}
	.dashboard-content {
		max-height: calc(100vh - 56px);
		height: calc(100vh - 56px);
		width: calc(100vw - 56px - 500px);
		overflow: auto;
	}
	.dashboard-content-table {
		height: calc(100vh - 56px - 40px);
	}
</style>
