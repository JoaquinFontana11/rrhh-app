import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Filter, Licencia } from '$lib/types';

const filters: Filter[] = JSON.parse(localStorage.getItem('filter-licencia') as string);

const filterStore: Writable<Filter[]> = writable(filters || []);
const LicenciaStore: Writable<Licencia | any> = writable({});
const pageStore: Writable<number> = writable(0);
const cantPageStore: Writable<number> = writable(10);
const tipoLicenciaStore: Writable<string> = writable('ausente');

export { filterStore, LicenciaStore, tipoLicenciaStore, pageStore, cantPageStore };
