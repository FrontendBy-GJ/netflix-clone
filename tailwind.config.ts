import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-condensed': ['var(--font-ibm-condensed)'],
        'ibm-sans': ['var(--font-ibm-sans)'],
      },
      colors: {
        'netflix-red': 'rgb(244,67,54)',
      },
    },
  },
  plugins: [],
};
export default config;
