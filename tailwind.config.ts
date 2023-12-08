import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        posgray: '#292F36',
        posblue: '#4ECDC4',
        poslight: '#F7FFF7',
      },
    },
  },
  plugins: [],
};
export default config
