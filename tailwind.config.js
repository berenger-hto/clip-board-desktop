/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/renderer/**/*.{html,js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#258cf4",
                "background-light": "#f5f7f8",
                "background-dark": "#101922",
                "mac-close": "#ff5f57",
                "mac-minimize": "#ffbd2e",
                "mac-maximize": "#28c940"
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"]
            }
        },
    },
    plugins: [],
}
