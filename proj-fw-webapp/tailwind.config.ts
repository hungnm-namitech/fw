import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {},
      fontFamily: {
        'noto-sans-jp': 'var(--font-noto-sans-jp)',
        inter: 'var(--font-inter)',
        roboto: 'var(--font-roboto)',
      },
      textColor: {
        'text-black': '#222',
        gray: '#6B6B6B',
        bold: '#444',
        'text-placeholder': '#A8A8A8',
        primary: '#3C6255',
        danger: '#C53F3F',
        'dark-primary-contrast': '#fff',
        brown: '#5B4C35',
        border: '#CAD5DB',
      },
      colors: {
        'gray-1': '#CFCFCF',
        'gray-2': '#F5F7F8',
        tab: '#F7F7F7',
        darkPrimary: '#35433E',
        primary: '#3C6255',
        border: '#D9D9D9',
      },
      placeholderColor: {
        main: '#A8A8A8',
      },
      backgroundColor: {
        gray: '#F5F7F8',
        main: '#F1F1F1',
        card: '#FFF',
        btn: "#FFE5CC"
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '10': '40px',
        12: '48px',
        18: '72px',
      },
      borderRadius: {
        0.5: '2px',
        1: '4px',
        '1.5': '6px',
        2: '8px',
      },
      lineHeight: {
        1: '120%',
        2: '150%',
        normal: '100%',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
export default config;
