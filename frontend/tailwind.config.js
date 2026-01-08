/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {colors: {
      'bg-primary': '#0B0E14',
      'bg-main': '#0d1117',      
      'bg-surface': '#161b22',   
      'bg-subtle': '#21262d',    
      
      'accent-blue': {
        DEFAULT: '#3b82f6',      // Main Neon Blue
        glow: 'rgba(59, 130, 246, 0.4)', // For shadows/glows
      },
    },
    // Simplified "Glass" border for that sharp developer feel
    borderColor: {
      'glass': 'rgba(255, 255, 255, 0.08)',
    },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}