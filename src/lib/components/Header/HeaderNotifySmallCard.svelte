<script lang="ts">
	import { Icon, Bell } from 'svelte-hero-icons';
	export let info: String;
</script>

<div class="w-full h-auto bg-stone-300 rounded-md text-black">
	<p class="m-2">{info}</p>
</div>
