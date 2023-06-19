import Toggle from "./toggle";

export default function ThemeToggle(toggleSelector) {
    const preferenceQuery = '(prefers-color-scheme: dark)';
    const themeOptions = ['dark', 'light'];
    const startingMode = (
        window.matchMedia &&
        window.matchMedia(preferenceQuery).matches
    ) ? 0 : 1; // Values tied to ordering of themeOptions

    const toggleButton = document.querySelector(toggleSelector);
    const toggle = Toggle(themeOptions, startingMode);

    let userSelection = undefined;

    toggleButton.addEventListener('click', () => {
        const theme = toggle.next();

        document.body.dataset.theme = theme;
        userSelection = theme;
    });

    window.matchMedia(preferenceQuery).addEventListener('change', (event) => {
        const preference = event.matches;
        document.body.dataset.theme = userSelection || preference;

        // Keep toggle in sync with preferences
        if (preference !== toggle.now()) {
            toggle.next();
        }
    });
}