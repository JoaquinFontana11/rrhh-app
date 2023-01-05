import { writable, type Writable } from 'svelte/store';

export default writable(JSON.parse(localStorage.getItem('show') as string) || []);
export const showAllStore: Writable<true | false> = writable(
	localStorage.getItem('showAll') === 'true'
);
