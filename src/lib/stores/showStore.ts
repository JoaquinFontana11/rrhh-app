import { writable } from 'svelte/store';

export default writable(JSON.parse(localStorage.getItem('show')) || []);
export const showAllStore = writable(localStorage.getItem('showAll') || true);
