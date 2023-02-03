<script lang="ts">
	import { spring } from 'svelte/motion';

	let coords = spring({ x: 0, y: 0 });
	let deg = 0;

	coords.stiffness = 0.03;
	coords.damping = 0.1;
	setInterval(() => {
		deg = deg + 5;
	}, 5);

	const mouseMove = (e: MouseEvent) => {
		coords.set({ x: e.clientX - 72, y: e.clientY - 52 });
	};
</script>

<svelte:window on:mousemove={mouseMove} />

<div class="w-screen h-screen bg-lime-100 overflow-hidden">
	<img
		class="w-36 h-26 relative"
		style={`top: ${$coords.y}px; left: ${$coords.x}px; transform: rotate(${deg}deg) `}
		src="/joacko_cara.png"
		alt="la cara de joacko girando"
	/>
	<form
		method="POST"
		action="?/login"
		class="absolute top-1/2 left-1/2 flex flex-col -translate-x-1/2 -translate-y-1/2 gap-10 bg-white shadow-xl p-10 rounded-md"
	>
		<input
			type="email"
			name="email"
			placeholder="Ingrese email"
			class="p-2 bg-white border border-stone-200 outline-none rounded-lg focus:border-lime-500"
		/>
		<input
			type="password"
			name="password"
			placeholder="Ingrese contraseña"
			class="p-2 bg-white border border-stone-200 outline-none rounded-lg focus:border-lime-500"
		/>
		<input
			type="submit"
			class="p-2 bg-lime-500 rounded-lg hover:cursor-pointer hover:bg-lime-400"
		/>
		<span>En caso de no tener usuario, solicitelo al administrador</span>
	</form>
</div>
