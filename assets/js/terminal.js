// ── INTERACTIVE SIDEBAR TERMINAL ──
const Term = (function() {
  const body    = document.getElementById('side-term-body');
  const iRow    = document.getElementById('term-input-row');
  const prSpan  = document.getElementById('term-prompt');
  const typSpan = document.getElementById('term-typed-span');
  const inp     = document.getElementById('term-hidden');
  const termEl  = document.getElementById('float-term');
  if (!body || !inp) return {};

  let cwd = '~';
  let hist = [], hIdx = -1;
  let busy = false;

  const FS = {
    '~': ['README.md','career/','projects/','skills/','contact.sh'],
    '~/career':   ['experience.json','awards.md','education.md'],
    '~/projects': ['projects.ts'],
    '~/skills':   ['skills.json','cloud.json'],
  };
  const CAT = {
    'README.md':       'Shubham Sharma — Backend Engineer\n5+ years | Gurugram, India',
    'experience.json': 'SDE-I @ Innostax      Nov 2021 – Present\nAssociate @ Innostax  May 2021 – Nov 2021',
    'projects.ts':     'AI Appraisal System   Python, AWS Bedrock\nEnergyHire            .NET, Python\nTavaTrip              Node.js, AWS\nYokeru                Node.js, Event-Driven\nAI Voice Notif.       Node.js, Express',
    'skills.json':     'Languages:  JS · TS · Python · C#\nFrameworks: Node.js · NestJS · FastAPI\nDBs:        PostgreSQL · MongoDB · Redis',
    'cloud.json':      'AWS:   EC2 · Lambda · S3 · RDS · Bedrock\nAzure: Functions · Service Bus · SQL DB',
    'awards.md':       "Client's Hero of the Quarter  Jun 2025\nMentor of the Year            2024\nMentor of the Quarter         Dec 2024",
    'education.md':    'MCA — AKTU | CGPA 8.6 | 1st Rank\n2019 – 2021 · Lucknow, UP',
    'contact.sh':      'email: imshubhamofficial@gmail.com\nphone: +91 90680 80599\nwa:    wa.me/919068080599\ngh:    github.com/imshubhamofficial16',
  };
  const GIT_LOG = [
    'a3f1c2 feat: integrate AWS Bedrock AI pipeline',
    'b8e2d4 perf: reduce cloud costs by 68%',
    'c9d3e5 feat: semantic search w/ Hugging Face',
    'd4f2a1 fix: optimize API response latency',
    'e5b3c8 feat: no-code backend platform v2',
    'f6c4d9 docs: update README and portfolio',
  ];

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function emit(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }
  function emitText(text, cls) {
    String(text).split('\n').forEach(l => emit(`<span class="${cls||'st-out'}">${esc(l)}</span>`));
  }

  function updatePrompt() { if (prSpan) prSpan.textContent = cwd; }

  function run(cmd) {
    cmd = cmd.trim();
    if (!cmd) return;
    hist.push(cmd); hIdx = hist.length;

    const parts = cmd.split(/\s+/), verb = parts[0].toLowerCase();
    emit(`<span class="st-pr">${esc(cwd)}</span><span class="st-sep"> % </span><span class="st-cmd">${esc(cmd)}</span>`);

    switch(verb) {
      case 'clear': body.innerHTML = ''; break;

      case 'help':
        emitText('ls  cat  nano  cd  pwd  whoami  echo  date\ngit log  git status  node -v  python --version\nclear  history', 'st-out');
        break;

      case 'pwd':
        emitText(cwd.replace('~','/home/shubham'), 'st-out'); break;

      case 'whoami':
        emitText('Shubham Sharma — Backend Engineer', 'st-out'); break;

      case 'ls': {
        const list = FS[cwd] || FS['~'];
        emit(`<span class="st-out">${list.map(esc).join('  ')}</span>`); break;
      }

      case 'cd': {
        const t = parts[1]||'~';
        if (t==='~'||t==='/'||t==='/home/shubham') { cwd='~'; break; }
        if (t==='..') { cwd='~'; break; }
        const k = '~/'+t.replace(/\/$/,'');
        if (FS[k]) cwd=k;
        else emitText(`cd: ${t}: No such directory`,'st-out');
        break;
      }

      case 'cat': case 'nano': {
        const f = parts[1];
        if (!f) { emitText(`${verb}: missing filename`,'st-out'); break; }
        const c = CAT[f];
        c ? emitText(c,'st-out') : emitText(`${verb}: ${f}: No such file`,'st-out');
        break;
      }

      case 'git': {
        const sub = parts[1];
        if (sub==='log') {
          const nFlag = parts.find(p=>/^-\d+$/.test(p));
          const n = nFlag ? Math.abs(parseInt(nFlag)) : 4;
          emitText(GIT_LOG.slice(0,Math.min(n,GIT_LOG.length)).join('\n'),'st-out');
        } else if (sub==='status') {
          emitText('On branch main\nNothing to commit, working tree clean','st-out');
        } else if (sub==='branch') {
          emitText('* main','st-out');
        } else {
          emitText(`git: '${sub||''}' is not a recognised subcommand`,'st-out');
        }
        break;
      }

      case 'node':
        emitText(parts[1]==='-v'||parts[1]==='--version' ? 'v20.11.0' : 'use node -v for version','st-out'); break;

      case 'npm':
        emitText(parts[1]==='-v'||parts[1]==='--version' ? '10.2.4' : '','st-out'); break;

      case 'python': case 'python3':
        emitText(parts[1]==='--version' ? 'Python 3.11.5' : 'Python 3.11.5','st-out'); break;

      case 'echo':
        emitText(parts.slice(1).join(' ').replace(/^["']|["']$/g,''),'st-out'); break;

      case 'date':
        emitText(new Date().toLocaleString(),'st-out'); break;

      case 'history':
        emitText(hist.slice(-10).map((c,i)=>`  ${String(i+1).padStart(3)}  ${c}`).join('\n'),'st-out'); break;

      default:
        emitText(`${verb}: command not found — try 'help'`,'st-out');
    }
    updatePrompt();
    body.scrollTop = body.scrollHeight;
  }

  // Keyboard handling
  if (termEl) termEl.addEventListener('click', ()=>{ if(!busy) inp.focus(); });
  inp.addEventListener('input', ()=>{ if(typSpan) typSpan.textContent = inp.value; });
  inp.addEventListener('keydown', e=>{
    if (e.key==='Enter') {
      const cmd = inp.value; inp.value=''; if(typSpan) typSpan.textContent='';
      run(cmd);
    } else if (e.key==='ArrowUp') {
      e.preventDefault();
      if (hIdx>0) hIdx--;
      inp.value = hist[hIdx]||''; if(typSpan) typSpan.textContent=inp.value;
    } else if (e.key==='ArrowDown') {
      e.preventDefault();
      if (hIdx<hist.length-1) hIdx++; else hIdx=hist.length;
      inp.value = hist[hIdx]||''; if(typSpan) typSpan.textContent=inp.value;
    }
  });

  // Auto-type intro sequence
  const INTRO = [
    { cmd:'cd shubham_sharma/' },
    { cmd:'ls' },
    { cmd:'cat README.md' },
    { cmd:'git log -4' },
    { cmd:'node -v' },
    { cmd:'python --version' },
    { cmd:'cd career/' },
    { cmd:'ls' },
    { cmd:'cat experience.json' },
    { cmd:'cd ..' },
    { cmd:'cd skills/' },
    { cmd:'cat cloud.json' },
    { cmd:'cd ..' },
    { cmd:'git status' },
    { cmd:'whoami' },
    { cmd:'cat projects.ts' },
    { cmd:'npm -v' },
  ];
  let si=0;
  function typeIntro() {
    if (si>=INTRO.length) {
      busy=false;
      if(iRow) iRow.style.display='flex';
      updatePrompt();
      return;
    }
    const {cmd} = INTRO[si++];
    const line = document.createElement('div');
    line.innerHTML=`<span class="st-pr">${esc(cwd)}</span><span class="st-sep"> % </span><span class="st-cmd"></span><span class="st-cur"></span>`;
    body.appendChild(line);
    const cs=line.querySelector('.st-cmd'), cr=line.querySelector('.st-cur');
    let ci=0;
    const iv=setInterval(()=>{
      if(ci<cmd.length){ cs.textContent+=cmd[ci++]; body.scrollTop=body.scrollHeight; }
      else {
        clearInterval(iv); cr.remove();
        setTimeout(()=>{
          const parts=cmd.trim().split(/\s+/), verb=parts[0];
          if(verb==='cd'){ const k='~/'+((parts[1]||'').replace(/\/$/,'')); if(FS[k])cwd=k; }
          else if(verb==='ls'){ const list=FS[cwd]||FS['~']; emit(`<span class="st-out">${list.map(esc).join('  ')}</span>`); }
          else if(verb==='cat'||verb==='nano'){ const c=CAT[parts[1]]; if(c)emitText(c,'st-out'); }
          else if(verb==='git'){ const nF=parts.find(p=>/^-\d+$/.test(p)); const n=nF?Math.abs(parseInt(nF)):3; emitText(GIT_LOG.slice(0,n).join('\n'),'st-out'); }
          else if(verb==='node'){ emitText('v20.11.0','st-out'); }
          body.scrollTop=body.scrollHeight;
          setTimeout(typeIntro, 750);
        },300);
      }
    },52);
  }
  busy=true;
  setTimeout(typeIntro, 500);

  return { runCmd: run, typeCmd: function(cmd){ if(!busy){ inp.focus(); typeIntroCmd(cmd); } },
    typeIntroCmd: function(cmd) {
      busy=true;
      if(iRow) iRow.style.display='none';
      const line=document.createElement('div');
      line.innerHTML=`<span class="st-pr">${esc(cwd)}</span><span class="st-sep"> % </span><span class="st-cmd"></span><span class="st-cur"></span>`;
      body.appendChild(line);
      const cs=line.querySelector('.st-cmd'), cr=line.querySelector('.st-cur');
      let ci=0;
      const iv=setInterval(()=>{
        if(ci<cmd.length){ cs.textContent+=cmd[ci++]; body.scrollTop=body.scrollHeight; }
        else {
          clearInterval(iv); cr.remove();
          setTimeout(()=>{ run(cmd); busy=false; if(iRow)iRow.style.display='flex'; },280);
        }
      },52);
    }
  };
})();

// ── FLOATING TERMINAL ──
function toggleFloatTerm() {
  const ft = document.getElementById('float-term');
  const hidden = ft.classList.toggle('ft-hidden');
  if (!hidden) {
    const inp = document.getElementById('term-hidden');
    if (inp) setTimeout(() => inp.focus(), 100);
  }
}

(function() {
  const ft  = document.getElementById('float-term');
  const bar = document.getElementById('float-term-drag');
  const cls = document.getElementById('ft-close');
  if (!ft || !bar) return;

  if (cls) cls.addEventListener('click', e => { e.stopPropagation(); ft.classList.add('ft-hidden'); });

  let dragging = false, ox = 0, oy = 0;
  bar.addEventListener('mousedown', e => {
    if (e.target === cls) return;
    dragging = true;
    const r = ft.getBoundingClientRect();
    ox = e.clientX - r.left; oy = e.clientY - r.top;
    ft.style.transition = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const x = Math.max(0, Math.min(window.innerWidth  - ft.offsetWidth,  e.clientX - ox));
    const y = Math.max(0, Math.min(window.innerHeight - ft.offsetHeight, e.clientY - oy));
    ft.style.left = x + 'px'; ft.style.top = y + 'px';
    ft.style.right = 'auto';  ft.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; ft.style.transition = 'opacity .2s,transform .2s'; }
  });

  ft.addEventListener('click', () => {
    const inp = document.getElementById('term-hidden');
    if (inp) inp.focus();
  });
})();

// ── CALENDLY WIDGET TOGGLE ──
function toggleCalWidget() {
  const cw = document.getElementById('cal-widget');
  if (cw) cw.classList.toggle('ft-hidden');
}

// ── CALENDLY WIDGET DRAG ──
(function() {
  const cw  = document.getElementById('cal-widget');
  const bar = document.getElementById('cal-widget-drag');
  if (!cw || !bar) return;
  let dragging = false, ox = 0, oy = 0;
  bar.addEventListener('mousedown', e => {
    dragging = true;
    const r = cw.getBoundingClientRect();
    ox = e.clientX - r.left; oy = e.clientY - r.top;
    cw.style.transition = 'none'; e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const x = Math.max(0, Math.min(window.innerWidth  - cw.offsetWidth,  e.clientX - ox));
    const y = Math.max(0, Math.min(window.innerHeight - cw.offsetHeight, e.clientY - oy));
    cw.style.left = x+'px'; cw.style.top = y+'px'; cw.style.right='auto'; cw.style.bottom='auto';
  });
  document.addEventListener('mouseup', () => { if (dragging) { dragging = false; cw.style.transition = 'opacity .2s,transform .2s'; } });
})();
