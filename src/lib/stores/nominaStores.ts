import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Filter, Agente, Order, Show } from '$lib/types';

const filters: Filter[] = JSON.parse(localStorage.getItem('filter') as string);
const order: Order = JSON.parse(localStorage.getItem('order') as string);
const shows: Show[] = JSON.parse(localStorage.getItem('show') as string);
const showAll = localStorage.getItem('showAll') == 'true';

const filterStore: Writable<Filter[]> = writable(filters || []);
const agenteStore: Writable<Agente | any> = writable({});
const orderStore: Writable<Order> = writable(order || { field: 'DNI', direction: true });
const pageStore: Writable<number> = writable(0);
const cantPageStore: Writable<number> = writable(10);
const showStore: Writable<Show[]> = writable(shows || []);
const showAllStore: Writable<boolean> = writable(showAll);

export { filterStore, agenteStore, orderStore, pageStore, cantPageStore, showStore, showAllStore };
