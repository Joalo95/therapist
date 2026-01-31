/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        typing: 'blink 1s steps(5, start) infinite'
      },
      backgroundImage: {
        gradient: 'linear-gradient(180deg, rgba(247,244,238,0), #f7f4ee 58.85%)'
      },
      keyframes: {
        blink: {
          to: { visibility: 'hidden' }
        }
      },
      colors: {
        /* Palette aligned with light, natural, relaxing theme */
        gptlogo: '#4AAE84', /* calm green */
        gptdarkgray: '#F7F4EE', /* page background */
        gptgray: '#E9E6E1', /* panels / tiles */
        gptlightgray: '#F0EEE9' /* cards / inputs */
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        heading: ['Merriweather', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Roboto Mono']
      }
    }
  },
  plugins: []
}
