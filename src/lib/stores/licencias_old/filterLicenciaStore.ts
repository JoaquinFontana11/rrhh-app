import { writable } from 'svelte/store';

export default writable(JSON.parse(localStorage.getItem('filter-licencia')) || []);
