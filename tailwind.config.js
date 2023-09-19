/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./views/**/*.ejs', 'node_modules/preline/dist/*.js'],
	theme: {
		extend: {
			colors: {
				primary: '#1565D8',
				dark: {
					light: '#5A7184',
					hard: '#0D2436',
					soft: '#183B56',
				},
			},
			fontFamily: {
				opensans: ["'Open Sans'", 'sans-serif'],
				roboto: ["'Roboto'", 'sans-serif'],
			},
		},
	},
	plugins: [
		require('daisyui'), // Add the DaisyUI plugin
		{
			tailwindcss: {},
			autoprefixer: {},
		},
		require('preline/plugin'),
	],
	daisyui: {
		themes: [
			'light',
			'dark',
			'cupcake',
			{
				mytheme: {
					primary: '#1565D8',
					secondary: '#d926a9',
					accent: '#1fb2a6',
					neutral: '#2a323c',
					'base-100': '#ffffff', // Adjust this to a light color
					info: '#3abff8',
					success: '#36d399',
					warning: '#fbbd23',
					error: '#f87272',
				},
			},
		],
	},
};
