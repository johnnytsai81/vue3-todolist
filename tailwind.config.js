/**
 * Tailwind CSS configuration file
 * https://tailwindcss.com/docs/configuration
 *
 * Note: Tailwind CSS v4 does not require a JS file configuration anymore
 * but it's still useful for advanced configuration and IntelliSense support in IDEs.
 */

/** @type {import('tailwindcss/tailwind-config')} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
	],
	safelist: [
		'lg:col-span-1',
		'lg:col-span-2',
		'lg:col-span-3',
		'lg:col-span-4',
		'col-span-1',
		'col-span-2',
		'col-span-3',
		'col-span-4',
	],
	theme: {
		colors: {
			green: {
				200: '#E7FFE9',
				300: '#A1FFC7',
				400: '#81F8B1',
			},
			gray: {
				200: '#EBEBEB',
				900: '#000000',
			}
		},
		extend: {},
	},
	plugins: [],
}
