/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        blur: {
          "0%, 100%": { filter: "blur(63px)" }, // Blur pada 0% dan kembali ke 0px di 100%
          "50%": { filter: "blur(62px)" },
        },
        move: {
          "0%": { transform: "translateY(0) translateX(0)"  },
          "25%": { transform: "translateY(100px) translateX(-300px)" },
          "50%": { transform: "translateY(-300px) translateX(100px)" },
          "75%": { transform: "translateY(100px) translateX(100px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
      },
      animation: {
        blur: "blur 5s ease-in-out infinite",
        move: "move 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
