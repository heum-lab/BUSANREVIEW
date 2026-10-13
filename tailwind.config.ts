import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D49205',
          50: '#FDF6E7',
          100: '#FBEBC4',
          200: '#F7D98A',
          300: '#F0C04A',
          400: '#E3A91E',
          500: '#D49205',
          600: '#B87D04',
          700: '#9C6903',
          800: '#7D5402',
          900: '#5E3F02',
        },
        ink: {
          900: '#0B0D12',
          50: '#F5F6F8',
          800: '#1A1D24',
          700: '#2A2E37',
          500: '#5B6271',
          300: '#A6ABB7',
          100: '#E5E7EC',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'sans-serif',
        ],
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(11, 13, 18, 0.06)',
        elevated: '0 12px 40px rgba(11, 13, 18, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
