/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
        IstokWebRegular: ["Istok Web Regular", "sans-serif"],
        IstokWebBold: ["Istok Web Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
