// ── DOWNLOAD CV PROGRESS ──
(function() {
  const btn = document.getElementById('cv-btn');
  const toast = document.getElementById('dl-toast');
  const fill = document.getElementById('dl-fill');
  const msg = document.getElementById('dl-msg');
  if (!btn || !toast) return;

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    toast.classList.add('show');
    fill.style.width = '0%';
    msg.textContent = 'Connecting to server...';

    let pct = 0;
    const msgs = [
      [15,  'Resolving host...'],
      [35,  'Downloading Shubham_Sharma.pdf...'],
      [60,  'Downloading Shubham_Sharma.pdf...'],
      [80,  'Downloading Shubham_Sharma.pdf...'],
      [95,  'Verifying integrity...'],
      [100, '✓ Saved — Shubham_Sharma.pdf (111 KB)'],
    ];
    let mi = 0;

    const iv = setInterval(() => {
      pct = Math.min(pct + (Math.random() * 5 + 2), 100);
      fill.style.width = pct + '%';

      if (mi < msgs.length && pct >= msgs[mi][0]) {
        msg.textContent = msgs[mi][1];
        mi++;
      }

      if (pct >= 100) {
        clearInterval(iv);
        const a = document.createElement('a');
        a.href = 'Shubham_Sharma.pdf';
        a.download = 'Shubham_Sharma.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => { fill.style.width = '0%'; }, 300);
        }, 2000);
      }
    }, 70);
  });
})();

// ── NAV PROGRESS TOAST ──
const NPB = (function() {
  const toast = document.getElementById('npb-toast');
  const cmd   = document.getElementById('npb-cmd');
  const pct   = document.getElementById('npb-pct');
  const msg   = document.getElementById('npb-msg');
  const bar   = document.getElementById('npb-bar');
  let tid = null, ivl = null;

  const cmdMap = {
    'github.com':   '$ open github.com',
    'linkedin.com': '$ open linkedin.com',
    'wa.me':        '$ open whatsapp',
    'mailto:':      '$ open mail.app',
    'tel:':         '$ call +91',
  };
  const msgMap = {
    'github.com':   'Opening GitHub...',
    'linkedin.com': 'Opening LinkedIn...',
    'wa.me':        'Opening WhatsApp...',
    'mailto:':      'Launching mail app...',
    'tel:':         'Initiating call...',
  };
  const secCmd = {
    's-readme':'$ cat README.md','s-experience':'$ cat experience.json',
    's-projects':'$ cat projects.ts','s-skills':'$ cat skills.json',
    's-cloud':'$ cat cloud.json','s-awards':'$ cat awards.md',
    's-education':'$ cat education.md','s-chat':'$ node chat.ai','s-contact':'$ bash contact.sh',
  };
  const secMsg = {
    's-readme':'Opening README...','s-experience':'Loading Experience...',
    's-projects':'Loading Projects...','s-skills':'Loading Skills...',
    's-cloud':'Loading Cloud info...','s-awards':'Loading Awards...',
    's-education':'Loading Education...','s-chat':'Loading AI Chat...','s-contact':'Opening Contact...',
  };

  function getInfo(a) {
    const href = (a && a.getAttribute('href')) || '';
    for (const [k,v] of Object.entries(cmdMap)) {
      if (href.includes(k)) return { cmd: v, lbl: msgMap[k] };
    }
    return { cmd: '$ open link', lbl: 'Opening link...' };
  }

  function run(cmdTxt, lblTxt, dur) {
    clearTimeout(tid); clearInterval(ivl);
    bar.style.transition = 'none'; bar.style.width = '0%';
    if (cmd) cmd.textContent = cmdTxt;
    if (msg) msg.textContent = lblTxt;
    if (pct) pct.textContent = '0%';
    toast.classList.add('npb-tshow');
    void toast.offsetWidth;

    let p = 0;
    const step = 100 / (dur / 60);
    ivl = setInterval(() => {
      p = Math.min(p + step * (0.5 + Math.random()), 92);
      bar.style.transition = 'width 55ms linear';
      bar.style.width = p + '%';
      if (pct) pct.textContent = Math.round(p) + '%';
    }, 60);

    tid = setTimeout(() => {
      clearInterval(ivl);
      bar.style.transition = 'width 180ms linear';
      bar.style.width = '100%';
      if (pct) pct.textContent = '100%';
      setTimeout(() => {
        toast.classList.remove('npb-tshow');
        setTimeout(() => { bar.style.width = '0%'; }, 300);
      }, 500);
    }, dur);
  }

  // External links
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.id === 'cv-btn') return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) return;
    const ext = a.target === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:');
    if (ext) { const i = getInfo(a); run(i.cmd, i.lbl, 1400); }
  });

  // Patch goTo for internal navigation
  const _goTo = window.goTo;
  if (typeof _goTo === 'function') {
    window.goTo = function(id) {
      run(secCmd[id] || '$ navigate', secMsg[id] || 'Navigating...', 420);
      _goTo(id);
    };
  }

  return { run };
})();

// ── FOOTER DYNAMIC TEXT ──
(function() {
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  const phrases = [
    '$ engineered for scale',
    '$ architecting microservices',
    '$ shipping AI-driven backends',
    '$ optimizing for performance',
    '$ building distributed systems',
    '$ obsessed with clean APIs',
  ];
  const el = document.getElementById('footer-phrase');
  if (!el) return;

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const target = phrases[pi];
    if (!deleting) {
      el.textContent = target.slice(0, ++ci);
      if (ci === target.length) { deleting = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 48);
    } else {
      el.textContent = target.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 320); return; }
      setTimeout(tick, 26);
    }
  }
  tick();
})();

// ── IDE LOADER ──
(function() {
  const loader = document.getElementById('ide-loader');
  if (!loader) return;

  const tasks = loader.querySelectorAll('.ld-task');

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function animateTask(task) {
    const dur   = parseInt(task.dataset.dur) || 400;
    const fill  = task.querySelector('.ld-fill');
    const pctEl = task.querySelector('.ld-tpct');

    task.classList.add('ld-show');
    await sleep(60);

    fill.style.transition = 'width ' + dur + 'ms linear';
    fill.style.width = '100%';

    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(Math.round((elapsed / dur) * 100), 100);
      if (pctEl) pctEl.textContent = pct + '%';
      if (pct < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    await sleep(dur + 40);
    if (pctEl) pctEl.textContent = '100%';
    task.classList.add('ld-done-t');
  }

  async function runLoader() {
    await sleep(80);
    for (let i = 0; i < tasks.length; i++) {
      await animateTask(tasks[i]);
      await sleep(i < tasks.length - 1 ? 30 : 320);
    }
    loader.classList.add('ld-done');
    setTimeout(() => { loader.remove(); }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoader);
  } else {
    runLoader();
  }
})();

// ── MOBILE NOTICE (show once) ──
(function() {
  if (localStorage.getItem('mn-seen') === '1') return;
  if (window.innerWidth > 1024) return;

  setTimeout(() => {
    const overlay  = document.getElementById('mobile-notice');
    const copyBtn  = document.getElementById('mn-copy');
    const contBtn  = document.getElementById('mn-continue');
    const bmkBtn   = document.getElementById('mn-bookmark');
    if (!overlay) return;

    function dismiss() {
      overlay.classList.remove('mn-show');
      localStorage.setItem('mn-seen', '1');
    }

    overlay.classList.add('mn-show');

    bmkBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Shubham Sharma — Backend Engineer',
          text: 'Portfolio of Shubham Sharma, Backend Engineer',
          url: location.href,
        }).then(dismiss).catch(() => {});
      } else {
        bmkBtn.textContent = 'Press Ctrl+D / ⌘D to bookmark';
        bmkBtn.disabled = true;
        setTimeout(() => {
          bmkBtn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Bookmark / Add to Home Screen';
          bmkBtn.disabled = false;
        }, 2500);
      }
    });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(location.href).then(() => {
        copyBtn.textContent = '✓ Link Copied!';
        copyBtn.style.background = '#22d3ee';
        copyBtn.style.color = '#fff';
        setTimeout(dismiss, 1400);
      }).catch(() => {
        const tmp = document.createElement('input');
        tmp.value = location.href;
        document.body.appendChild(tmp);
        tmp.select(); document.execCommand('copy');
        document.body.removeChild(tmp);
        copyBtn.textContent = '✓ Link Copied!';
        copyBtn.style.background = '#22d3ee';
        copyBtn.style.color = '#fff';
        setTimeout(dismiss, 1400);
      });
    });

    contBtn.addEventListener('click', dismiss);
    overlay.addEventListener('click', e => { if (e.target === overlay) dismiss(); });
  }, 800);
})();
