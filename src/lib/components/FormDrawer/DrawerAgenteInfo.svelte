<script lang="ts">
	import DrawerDropDownButton from './FormDrawerInputGroupButton.svelte';
	import DrawerTableInfo from './DrawerTableInfo.svelte';

	const formNames = ['datosSalud', 'datosAcademicos', 'recorrido'];
	const dropdown = {
		datosSalud: false,
		datosAcademicos: false,
		recorrido: false
	};
	const labels = {
		datosPersonales: 'Datos Personales',
		datosSalud: 'Datos de Salud',
		datosAcademicos: 'Datos Academicos',
		recorrido: 'Recorrido'
	};
</script>

<div class="p-2 flex flex-col items-center w-full scrollbar-thin scrollbar-w-10 overflow-y-scroll">
	{#each formNames as formName}
		<DrawerDropDownButton
			validate={true}
			dropdown={() => {
				dropdown[formName] = !dropdown[formName];
			}}
			label={labels[formName]}
		/>
		{#if dropdown[formName]}
			<DrawerTableInfo />
		{/if}
	{/each}
</div>
