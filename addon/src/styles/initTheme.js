function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');

    let existing = document.getElementById('theme-stylesheet');
    if (!existing) {
        existing = document.createElement('link');
        existing.rel = 'stylesheet';
        existing.id = 'theme-stylesheet';
        document.head.appendChild(existing);
    }
    existing.href = chrome.runtime?.getURL
        ? chrome.runtime.getURL(`styles/${dark ? 'tailwind3-dark.css' : 'tailwind3.css'}`)
        : `/styles/${dark ? 'tailwind3-dark.css' : 'tailwind3.css'}`; // For localhost
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(prefersDark);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    setTheme(e.matches);
});
