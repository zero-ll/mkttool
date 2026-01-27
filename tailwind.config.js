/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                heading: ['Poppins', 'Inter', 'sans-serif'],
            },
            colors: {
                // Warm Orange Primary
                primary: {
                    DEFAULT: '#FF6B35',
                    hover: '#FF5722',
                    light: '#FFE5DC',
                    dark: '#E65100',
                },
                // Soft Neutrals
                surface: {
                    DEFAULT: '#FFFFFF',
                    secondary: '#FFF8F5',
                    tertiary: '#FAFAFA',
                },
                // Text Hierarchy
                text: {
                    primary: '#2D3436',
                    secondary: '#636E72',
                    tertiary: '#B2BEC3',
                },
                // Accent Colors
                success: '#00B894',
                warning: '#FDCB6E',
                error: '#FF7675',
                info: '#74B9FF',
                // Borders
                border: {
                    DEFAULT: '#E8E8E8',
                    hover: '#DDDDDD',
                    subtle: '#F0F0F0',
                }
            },
            borderRadius: {
                'soft': '12px',
                'soft-lg': '16px',
                'soft-xl': '20px',
                'soft-2xl': '24px',
            },
            boxShadow: {
                'soft-xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
                'soft-sm': '0 2px 4px rgba(0, 0, 0, 0.06)',
                'soft': '0 4px 8px rgba(0, 0, 0, 0.08)',
                'soft-md': '0 4px 8px rgba(0, 0, 0, 0.08)',
                'soft-lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
                'soft-xl': '0 12px 24px rgba(0, 0, 0, 0.12)',
                'glow-orange': '0 4px 20px rgba(255, 107, 53, 0.25)',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
