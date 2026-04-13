import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9f9f9",
        foreground: "#1a1c1c",
        primary: "#000000",
        "on-primary": "#e2e2e2",
        "primary-container": "#3b3b3b",
        "primary-fixed": "#5e5e5e",
        "primary-fixed-dim": "#474747",
        secondary: "#954742",
        tertiary: "#692523",
        "on-secondary": "#ffffff",
        "on-background": "#1a1c1c",
        "on-surface": "#1a1c1c",
        surface: "#f9f9f9",
        "surface-container": "#eeeeee",
        "surface-container-low": "#f3f3f3",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        outline: "#777777",
        "outline-variant": "#c6c6c6",
        error: "#ba1a1a",
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
      fontFamily: {
        headline: ["Epilogue", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        label: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
