import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#09090B',
        'bg-surface': '#111113',
        'bg-elevated': '#18181B',
        'border-subtle': '#27272A',
        'border-default': '#3F3F46',
        'border-focus': '#6366F1',
        'text-primary': '#FAFAFA',
        'text-secondary': '#A1A1AA',
        'text-muted': '#52525B',
        'accent-primary': '#6366F1',
        'accent-hover': '#818CF8',
        'accent-subtle': '#6366F114',
        'accent-glow': '#6366F130',
        'regime-laminar': '#22C55E',
        'regime-transicion': '#EAB308',
        'regime-incipiente': '#F97316',
        'regime-severo': '#EF4444',
        'regime-laminar-bg': '#22C55E1F',
        'regime-transicion-bg': '#EAB3081F',
        'regime-incipiente-bg': '#F973161F',
        'regime-severo-bg': '#EF44441F',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
};

export default config;