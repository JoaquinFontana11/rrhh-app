<script lang="ts">
	import { fly } from 'svelte/transition';
	import HeaderNotifySmallCard from './HeaderNotifySmallCard.svelte';
	import HeaderNotifyButton from './HeaderNotifyButton.svelte';
</script>

<!-- <div
	class=" content-[''] w-0 h-0 absolute ml-[2px] mt-[-10px] rotate-[20deg] border border-b-[20px] border-b-stone-900 border-r-[12px] border-r-transparent border-l-[12px] border-l-transparent border-t-transparent dark:border-b-black"
/> -->
<div
	class="bg-white drop-shadow-lg absolute top-12 right-8 text-stone-300 w-80 z-50 h-40 rounded-md  overflow-auto scrollbar-thin scrollbar-thumb-stone-400 scrollbar-w-1 scrollbar-thumb-rounded-md dark:bg-black"
	transition:fly
>
	<div class="flex flex-row gap-3 m-2">
		<HeaderNotifyButton text="F1" type="" />
		<HeaderNotifyButton text="F2" type="" />
		<HeaderNotifyButton text="F3" type="" />
	</div>
	<div class="flex flex-col justify-center gap-2 mx-2 mb-5">
		<HeaderNotifySmallCard info="El sexo..." category="alerta" />
		<HeaderNotifySmallCard info="es una buena OPCION??!!!" category="peligro" />
		<HeaderNotifySmallCard info="lo averiguaremos en el proximo capitulo" category="bien" />
		<HeaderNotifySmallCard info="mentira, es buenisimo" category="peligro" />
	</div>
</div>
