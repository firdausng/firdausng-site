import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch', // add required value here
          }
        }
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.slate,
        green: colors.emerald,
        purple: colors.violet,
        yellow: colors.amber,
        pink: colors.fuchsia,
        primary: {
          '50': '#eff9fc',
          '100': '#d7eef6',
          '200': '#b4dded',
          '300': '#80c5e0',
          '400': '#45a2cb',
          '500': '#277da5',
          '600': '#256c95',
          '700': '#255979',
          '800': '#264a64',
          '900': '#233f56',
          '950': '#12273a',
        },
        app: {
          DEFAULT: "#64748B",
          darkest: '#0F172A',
          dark: '#334155',
          light: '#E2E8F0',
          lightest: '#F1F5F9',
        },
      }
    },
  },

  plugins: [typography, forms, containerQueries],
  darkMode: 'class',
  safelist: [
    'text-2xl',
    'text-3xl',
    {
      pattern: /grid-cols-.+/,
      variants: ['md'],
    },
    {
      pattern: /(bg-|dark:bg-).+/
    },
  ],
} satisfies Config;
