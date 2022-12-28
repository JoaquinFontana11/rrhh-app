<script lang="ts">
	import HeaderNotifySmallCard from './HeaderNotifySmallCard.svelte';
	import HeaderNotifyButton from './HeaderNotifyButton.svelte';
</script>

<div
	class=" content-[''] w-0 h-0 absolute ml-[2px] mt-[-10px] rotate-[20deg] border border-b-[20px] border-b-stone-900 border-r-[12px] border-r-transparent border-l-[12px] border-l-transparent border-t-transparent dark:border-b-black"
/>
<div
	class="bg-stone-900 absolute top-14 right-5 text-stone-300 w-80 h-40 rounded-md  overflow-auto scrollbar-thin scrollbar-thumb-stone-400 scrollbar-w-1 scrollbar-thumb-rounded-md dark:bg-black"
>
	<div class="flex flex-row gap-3 m-2">
		<HeaderNotifyButton text="F1" type="" />
		<HeaderNotifyButton text="F2" type="" />
		<HeaderNotifyButton text="F3" type="" />
	</div>
	<div class="flex flex-col justify-center gap-2 mx-2 mb-5">
		<HeaderNotifySmallCard info="Informacion muy relevante para el desarrollo del personaje" />
		<HeaderNotifySmallCard info="Aca..... pasaron cosas" />
		<HeaderNotifySmallCard info="Pasaron muchas cosas muy relevantes....." />
		<HeaderNotifySmallCard info="Algun dia lo sabremos??" />
		<HeaderNotifySmallCard info="No lo se XD" />
	</div>
	<div class="m-2 flex justify-end">
		<HeaderNotifyButton text="Agregar Nota" type="add" />
	</div>
</div>
