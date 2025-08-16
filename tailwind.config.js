/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';

export default {
	plugins: [animate],
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				kprofile: generateColorScale('#297280'),
				kplayer: generateColorScale('#215A96'),
				kpartner: generateColorScale('#A89B7B'),
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
}

// Function to generate a color scale from 100-900 with your color as 500
function generateColorScale(baseColor) {
	return {
		100: adjustColor(baseColor, 80),
		200: adjustColor(baseColor, 60),
		300: adjustColor(baseColor, 40),
		400: adjustColor(baseColor, 20),
		500: baseColor,
		600: adjustColor(baseColor, -20),
		700: adjustColor(baseColor, -40),
		800: adjustColor(baseColor, -60),
		900: adjustColor(baseColor, -80),
	};
}

// Helper function to lighten/darken a hex color
function adjustColor(color, percent) {
	const num = parseInt(color.replace('#', ''), 16);
	const amt = Math.round(2.55 * percent);
	const R = (num >> 16) + amt;
	const G = ((num >> 8) & 0x00FF) + amt;
	const B = (num & 0x0000FF) + amt;

	return `#${(
		0x1000000 +
		(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
		(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
		(B < 255 ? (B < 1 ? 0 : B) : 255)
	)
		.toString(16)
		.slice(1)}`;
}