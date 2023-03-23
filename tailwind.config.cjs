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
					Green: '#84CC16',
					Black: '#414042'
				},
				dark: {
					Turquoise: '#509199',
					Rose: '#CB1B67',
					Grey: '#525252'
				},
				light: {
					Turquoise: '#60CCDA',
					Rose: '#EB3B87',
					Grey: '#B2B2B2',
					Black: '#787878'
				}
			}
		}
	},
	plugins: [require('tailwind-scrollbar')({ nocompatible: true })]
};
