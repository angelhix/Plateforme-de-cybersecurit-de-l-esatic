import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fonds — bleu nuit
        bg: '#071A2B',
        'bg-deep': '#020D17',
        surface: '#0E2233',
        'surface-2': '#123049',
        'surface-3': '#0B3D5C',
        border: '#1E3A52',
        'border-strong': '#2E5573',

        // Accents
        cyan: {
          DEFAULT: '#00B8D9',
          hover: '#33CBE6',
          press: '#0B7FA0',
        },
        green: {
          DEFAULT: '#00C853',
          hover: '#2EDB74',
          press: '#00A344',
        },

        // Niveaux
        lvl: {
          1: '#8BD3FF',
          2: '#F2C94C',
          3: '#FF8A65',
        },

        // Catégories
        cat: {
          sys: '#7C9CFF',
          recon: '#2DD4BF',
          web: '#E879F9',
          exploit: '#FB7185',
        },

        // Sémantiques
        success: '#00C853',
        danger: '#FF5C6C',
        warning: '#F2C94C',
        info: '#00B8D9',
        ethic: '#B39DFF',

        // Texte
        text: '#F4F7FA',
        'text-2': '#A9BCCB',
        'text-3': '#7F97AA',
        'text-disabled': '#5C7385',
        'on-accent': '#041018',

        // Rangs
        rank: {
          1: '#F2C94C',
          2: '#C9D6E0',
          3: '#D08A5B',
        },
      },

      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Cascadia Code', 'monospace'],
      },

      fontSize: {
        display: ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '1.25', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        sm: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        xs: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        code: ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
      },

      spacing: {
        sp1: '4px',
        sp2: '8px',
        sp3: '12px',
        sp4: '16px',
        sp5: '24px',
        sp6: '32px',
        sp7: '48px',
        sp8: '64px',
        sp9: '96px',
      },

      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '999px',
      },

      boxShadow: {
        pop: '0 8px 24px rgba(0, 0, 0, 0.4)',
        focus: '0 0 0 2px #071A2B, 0 0 0 4px #00B8D9',
      },

      animation: {
        blink: 'blink 1s steps(2, start) infinite',
        slideIn: 'slideIn 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        shake: 'shake 0.2s ease-in-out',
      },

      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideIn: {
          from: {
            transform: 'translateX(120%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },

      maxWidth: {
        container: '1200px',
      },

      minHeight: {
        tap: '44px',
        nav: '64px',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },

      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },

      backgroundColor: {
        'success-bg': 'rgba(0, 200, 83, 0.12)',
        'danger-bg': 'rgba(255, 92, 108, 0.12)',
        'warning-bg': 'rgba(242, 201, 76, 0.12)',
        'info-bg': 'rgba(0, 184, 217, 0.12)',
        'ethic-bg': 'rgba(179, 157, 255, 0.12)',
      },
    },
  },

  // Breakpoints (mobile-first)
  screens: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  plugins: [],
} satisfies Config
