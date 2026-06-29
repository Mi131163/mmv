/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-page': 'var(--bg-page)',
        'bg-surface': 'var(--bg-surface)',
        'bg-hover': 'var(--bg-hover)',
        'border-subtle': 'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-subtle': 'var(--accent-subtle)',
        'accent-border': 'var(--accent-border)',
        danger: 'var(--danger)',
        'danger-bg': 'var(--danger-bg)',
        warning: 'var(--warning)',
        'warning-bg': 'var(--warning-bg)',
        success: 'var(--success)',
        'success-bg': 'var(--success-bg)',
        neutral: 'var(--neutral)',
        'neutral-bg': 'var(--neutral-bg)',
        'card-rose': 'var(--card-rose)',
        'card-sand': 'var(--card-sand)',
        'card-mist': 'var(--card-mist)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
