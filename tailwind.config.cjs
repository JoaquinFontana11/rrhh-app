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
					Succes: '#22a954',
					Yellow: '#EDE836'
				},
				dark: {
					Turquoise: '#509199',
					Rose: '#CC035C',
					Grey: '#606062',
					Error: '#852F30',
					Succes: '#147D4A',
					Yellow: '#DED534'
				},
				light: {
					Turquoise: '#60CCDA',
					Rose: '#F54A91',
					Grey: '#B3B5B7',
					Error: '#EF4548',
					Succes: '#82C88B',
					Yellow: '#F9EF61'
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
