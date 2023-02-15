/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				DPMA: {
					Turquoise: '#00aec3',
					Grey: '#838383',
					Rose: '#e81f76',
					Error: '#BE1717',
					Succes: '#22a954',
					Green: '#84CC16',

					b: '#4DC300',
					c: '#76E81F',
					d: '#76E81F'
				},
				dark: {
					Turquoise: '#509199',
					Rose: '#CB1B67',
					Grey: '#525252'
				},
				light: {
					Turquoise: '#60CCDA',
					Rose: '#EB3B87',
					Grey: '#B2B2B2'
				}
			}
		}
	},
	plugins: [require('tailwind-scrollbar')({ nocompatible: true })]
};
