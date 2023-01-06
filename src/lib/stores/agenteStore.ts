import { writable, type Writable } from 'svelte/store';

export const agenteStore: Writable<any> = writable({
	datosSalud: {},
	datosAcademicos: {},
	recorrido: {}
});
