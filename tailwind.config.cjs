/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				Pastel: {
					Pink: '#F49AC2',
					Violet: '#B39EB5',
					Red: '#FF6961',
					Yellow: '#FDFD96',
					Orange: '#FFB347',
					Green: '#CCFBC4',
					Blue: '#779ECB',
					Brown: '#836953',
					Grey: '#CFCFC4'
				},
				DPMA: {
					Turquoise: '#00aec3',
					Grey: '#838383',
					Rose: '#e81f76',
					Error: '#BE1717',
					Succes: '#22a954'
				},
				dark: {
					Turquoise: '#509199',
					Rose: '#CB1B67',
					Grey: '#525252',
					Error: '#B62424'
				},
				light: {
					Turquoise: '#60CCDA',
					Rose: '#EB3B87',
					Grey: '#B2B2B2',
					Black: '#787878'
				},
				gradient: {
					Turquoise1: '#74c9e3',
					Turquoise2: '#a3d8e7',
					Turquoise3: '#cae7ea'
				}
			}
		}
	},
	plugins: [require('tailwind-scrollbar')({ nocompatible: true })]
};
