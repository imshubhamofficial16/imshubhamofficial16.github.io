// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  // Save manual override for today only; auto-resets tomorrow
  localStorage.setItem('ss-theme-ov', next);
  localStorage.setItem('ss-theme-ov-day', new Date().toDateString());
  updateThemeBtn(next);
}
function updateThemeBtn(t) {
  const ico = document.getElementById('theme-ico');
  const lbl = document.getElementById('theme-lbl');
  if (lbl) lbl.textContent = t === 'dark' ? 'Dark' : 'Light';
  if (ico) ico.innerHTML = t === 'dark'
    ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
}
// init
updateThemeBtn(document.documentElement.getAttribute('data-theme') || 'dark');
