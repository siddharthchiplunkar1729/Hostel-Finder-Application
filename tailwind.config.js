/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    hover: "hsl(var(--primary-hover))",
                    light: "hsl(var(--primary-light))",
                    dark: "hsl(var(--primary-dark))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    hover: "hsl(var(--secondary-hover))",
                    light: "hsl(var(--secondary-light))",
                    dark: "hsl(var(--secondary-dark))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                    hover: "hsl(var(--accent-hover))",
                    light: "hsl(var(--accent-light))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Aliases for retro-compatibility
                dark: {
                    DEFAULT: "#1E293B", // Deeper Slate
                    light: "#64748B",
                    card: "hsl(var(--card))",
                },
                light: {
                    DEFAULT: "#F8FAFC",
                    card: "#FFFFFF",
                    hover: "#F1F5F9",
                },
                // Status badge colors
                allocated: {
                    bg: '#DCFCE7',
                    text: '#166534',
                },
                vacant: {
                    bg: '#DBEAFE',
                    text: '#1E40AF',
                },
                maintenance: {
                    bg: '#FEE2E2',
                    text: '#991B1B',
                },
                // Status colors
                success: {
                    DEFAULT: '#22C55E',
                    light: '#DCFCE7',
                    dark: '#166534',
                },
                danger: {
                    DEFAULT: '#EF4444',
                    light: '#FEE2E2',
                    dark: '#991B1B',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
                '4xl': '32px',
                '5xl': '48px',
            },
            boxShadow: {
                'card': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 15px -3px rgba(0, 0, 0, 0.02)',
                'floating': '0 20px 50px -10px rgba(0, 0, 0, 0.08)',
                'elevated': '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
                'premium': '0 25px 50px -12px rgba(45, 108, 176, 0.15)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'bounce-subtle': 'bounceSubtle 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
