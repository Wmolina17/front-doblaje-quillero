/** @type {import('tailwindcss').Config} */
const scale = (name, steps) =>
  Object.fromEntries(steps.map((step) => [step, `rgb(var(--${name}-${step}) / <alpha-value>)`]));

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: scale("gold", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        ink: scale("ink", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        "on-gold": "#0B0B0A",
        success: "#22C55E",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Bebas Neue"', "sans-serif"],
        serif: ['"Cinzel"', "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F8E08A 0%, #D4AF37 45%, #B8912A 70%, #F5D77A 100%)",
        "gold-radial": "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.22), transparent 60%)",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(212,175,55,0.35), 0 10px 40px -10px rgba(212,175,55,0.35)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-15deg)" },
          "60%, 100%": { transform: "translateX(160%) skewX(-15deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        shine: "shine 2.2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
