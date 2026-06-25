// sections map → label
const SEC_LANG = {
  's-readme':     'Markdown',
  's-experience': 'JSON',
  's-projects':   'TypeScript',
  's-skills':     'JSON',
  's-cloud':      'JSON',
  's-awards':     'Markdown',
  's-education':  'Markdown',
  's-chat':       'AI · OpenRouter',
  's-contact':    'Shell Script'
};

const scroll = document.getElementById('scroll');

function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  scroll.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  setActive(id);
}

function setActive(id) {
  document.querySelectorAll('.file').forEach(f => f.classList.toggle('active', f.dataset.sec === id));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.sec === id));
  document.querySelectorAll('.mf-btn').forEach(b => b.classList.toggle('active', b.dataset.sec === id));
  const lang = document.getElementById('s-lang');
  if (lang) lang.textContent = SEC_LANG[id] || 'Text';
  // auto-expand the parent folder of the active file
  const activeFile = document.querySelector(`.file[data-sec="${id}"]`);
  if (activeFile) {
    const nest = activeFile.closest('.sub-nest');
    if (nest && nest.classList.contains('closed')) {
      const row = nest.previousElementSibling;
      if (row) toggleSub(row, nest.id);
    }
  }
}

// File → terminal filename map
const SEC_FILE = {
  's-readme':     'README.md',
  's-experience': 'experience.json',
  's-projects':   'projects.ts',
  's-skills':     'skills.json',
  's-cloud':      'cloud.json',
  's-awards':     'awards.md',
  's-education':  'education.md',
  's-chat':       'chat.ai',
  's-contact':    'contact.sh',
};

// Click nav items
document.querySelectorAll('[data-sec]').forEach(el => {
  el.addEventListener('click', () => {
    const sec = el.dataset.sec;
    goTo(sec);
    if (el.classList.contains('file') && Term && Term.typeIntroCmd) {
      const fname = SEC_FILE[sec];
      if (fname) setTimeout(() => Term.typeIntroCmd('cat ' + fname), 200);
    }
  });
});

// Scroll spy — highlight active section
const sections = ['s-readme','s-experience','s-projects','s-skills','s-cloud','s-awards','s-education','s-chat','s-contact'];
scroll.addEventListener('scroll', () => {
  const sy = scroll.scrollTop;
  let active = sections[0];
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= sy + 80) active = id;
  }
  setActive(active);
}, { passive: true });

// Sub-folder toggle
function toggleSub(row, nestId) {
  const nest = document.getElementById(nestId);
  if (!nest) return;
  const isOpen = !row.classList.contains('closed');
  row.classList.toggle('closed', isOpen);
  nest.classList.toggle('closed', isOpen);
  if (!isOpen) {
    nest.style.maxHeight = nest.scrollHeight + 'px';
    requestAnimationFrame(() => nest.style.maxHeight = nest.scrollHeight + 'px');
  } else {
    nest.style.maxHeight = nest.scrollHeight + 'px';
    requestAnimationFrame(() => nest.style.maxHeight = '0');
  }
}
// Init sub-nest max-heights so CSS transitions work
document.querySelectorAll('.sub-nest').forEach(n => {
  n.style.maxHeight = n.scrollHeight + 'px';
});

// Accordion
function toggleExp(head) {
  const card = head.closest('.exp-card');
  card.classList.toggle('open');
}
