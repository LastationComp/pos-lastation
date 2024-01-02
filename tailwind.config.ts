import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        posgray: '#292F36',
        posblue: '#4ECDC4',
        poslight: '#F7FFF7',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
