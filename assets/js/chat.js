// ── AI CHAT ──
// Layer 1 — XOR-obfuscated in source (sk-or-v1-… never appears in plain text)
const _ek = 'ABgACR1BH14AUE0VEU8EW1wIVxwDQUJKSwVfX15fTFNPQEMaXgldDwweCk0QRxpRWlUPWUgDT0QST1dXDg0KT1BBRkJPB1oNWQ==';
const _xp = ['ss-fo','lio-2x'].join('');
function _xd(b64,k){return[...atob(b64)].map((c,i)=>String.fromCharCode(c.charCodeAt(0)^k.charCodeAt(i%k.length))).join('')}

// Layer 2 — AES-GCM in localStorage (domain-locked: stolen entry won't work elsewhere)
async function _ckDK(){
  const e=new TextEncoder(),km=await crypto.subtle.importKey('raw',e.encode(location.hostname+'-ck'),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt:e.encode('ck-ss-24'),iterations:100000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function _ckEnc(txt){
  const iv=crypto.getRandomValues(new Uint8Array(12)),k=await _ckDK(),enc=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,new TextEncoder().encode(txt)),buf=new Uint8Array(12+enc.byteLength);
  buf.set(iv);buf.set(new Uint8Array(enc),12);return btoa(String.fromCharCode(...buf));
}
async function _ckDec(b64){
  const buf=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)),k=await _ckDK(),dec=await crypto.subtle.decrypt({name:'AES-GCM',iv:buf.slice(0,12)},k,buf.slice(12));
  return new TextDecoder().decode(dec);
}

async function chatGetKey(){
  const s=localStorage.getItem('_ck_e');
  if(s){try{return await _ckDec(s);}catch(e){localStorage.removeItem('_ck_e');}}
  const raw=_xd(_ek,_xp);
  try{localStorage.setItem('_ck_e',await _ckEnc(raw));}catch(e){}
  return raw;
}

async function chatSaveKey(){
  const v=document.getElementById('chat-key-inp').value.trim();
  if(!v)return;
  try{localStorage.setItem('_ck_e',await _ckEnc(v));}catch(e){localStorage.setItem('_ck_e',v);}
  localStorage.removeItem('or-key');
  document.getElementById('chat-key-row').style.display='none';
  chatAddMsg('ai','Key saved securely. Ask me anything about Shubham!');
}

const CHAT_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-20b:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
];
let _chatModelIdx = 0;

function chatSetModel(idx) {
  _chatModelIdx = parseInt(idx);
  const dot = document.querySelector('.chat-status-dot');
  const lbl = document.querySelector('.chat-status');
  if (dot && lbl) { dot.style.background = 'var(--amber)'; lbl.lastChild.textContent = 'switched'; setTimeout(() => { dot.style.background = 'var(--green)'; lbl.lastChild.textContent = 'ready'; }, 1200); }
}

function _chatSetStatus(txt, color) {
  const dot = document.querySelector('.chat-status-dot');
  const lbl = document.querySelector('.chat-status');
  if (dot) dot.style.background = color || 'var(--green)';
  if (lbl) lbl.lastChild.textContent = txt;
}

async function _chatFetch(key, messages) {
  for (let i = 0; i < CHAT_MODELS.length; i++) {
    const idx = (_chatModelIdx + i) % CHAT_MODELS.length;
    const model = CHAT_MODELS[idx];
    if (i > 0) _chatSetStatus('fallback ' + (i + 1), 'var(--amber)');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'HTTP-Referer': location.href,
        'X-Title': 'Shubham Sharma Portfolio',
      },
      body: JSON.stringify({ model, messages, max_tokens: 512, temperature: 0.65 }),
    });
    const data = await res.json();
    if ([429, 404].includes(data.error?.code) || [429, 404].includes(res.status)) continue;
    if (data.error) throw new Error(data.error.message || 'API error');
    if (i > 0) {
      _chatModelIdx = idx;
      const sel = document.getElementById('chat-model-sel');
      if (sel) sel.value = String(idx);
    }
    _chatSetStatus('ready', 'var(--green)');
    return data.choices?.[0]?.message?.content || 'Sorry, no response.';
  }
  _chatSetStatus('all busy', 'var(--rose)');
  throw new Error('All models are busy right now — try again in a moment.');
}

const CHAT_SYSTEM = `You are an AI assistant embedded in Shubham Sharma's portfolio website. Answer questions about Shubham concisely and professionally, strictly based on the profile below. If something is not covered, say you don't have that detail and suggest contacting Shubham directly at imshubhamofficial@gmail.com.

## Profile
Name: Shubham Sharma | Role: Backend Engineer (SDE-I) | Location: Gurugram, Haryana, India | Status: Open to opportunities

## Experience
- SDE-I @ Innostax Software Labs, Gurugram (Nov 2021 – Present)
  Led backend for TavaTrip — large-scale flight & hotel booking platform using Node.js and AWS, integrating Amadeus and TBO APIs with full production certification.
  Built a no-code backend platform: 80% developer productivity increase, 68% cloud cost reduction.
  Designed microservices architecture and distributed systems.
  Optimized APIs boosting customer satisfaction by 78%.
  Tech: Node.js, AWS, PostgreSQL, NestJS, Microservices, REST APIs

- Associate Software Engineer @ Innostax Software Labs (May 2021 – Nov 2021)
  Developed REST APIs integrating 30+ external systems for Texas-based multinational corporation.
  Improved data consistency to 98%. Automated workflows, reduced manual effort.
  Tech: Node.js, .NET, REST APIs, API Integration, Backend Automation

## Key Stats: 5+ years | 68% cloud cost cut | 80% dev productivity | 95% manual effort reduced | 78% customer satisfaction

## Projects
1. AI Automated Appraisal System (Jan 2026–Present): Python, AWS Bedrock, LLMs. AI workflow automation for compliance. 95% manual effort reduction.
2. EnergyHire Job Platform (Feb 2024–Jan 2026): Chief Architect. AI-driven job matching for energy sector. Hugging Face Transformers, Vector DB, .NET, Python.
3. TavaTrip Travel Platform (May 2022–May 2024): Lead backend. Node.js microservices, Amadeus & TBO APIs. Production certified globally.
4. Yokeru Healthcare AI (Dec 2024–Feb 2025): Event-driven healthcare. AI voice automation for patient notifications. Node.js, AWS.
5. AI Voice Notification System (Jan 2026–Mar 2026): Node.js, Express.js, AI voice for automated appointment scheduling.

## Skills
Languages: JavaScript, TypeScript, Python, SQL, C++
Backend: Node.js, NestJS, Express.js, FastAPI, .NET
Databases: PostgreSQL, MongoDB, Redis, MySQL
Messaging: RabbitMQ, Apache Kafka
Cloud & DevOps: AWS (EC2, S3, Lambda, Bedrock, SQS, SNS), Docker, CI/CD, Git
AI/ML: AWS Bedrock, LLMs, Hugging Face Transformers, Vector Search, Prompt Engineering
Architecture: Microservices, Event-Driven, REST APIs, GraphQL, System Design

## Contact
Email: imshubhamofficial@gmail.com | Phone: +91 90680 80599
LinkedIn: linkedin.com/in/skrishnatray | GitHub: github.com/imshubhamofficial16 | WhatsApp: wa.me/919068080599`;

const chatHistory = [];
let chatBusy = false;

function chatSend() {
  const inp = document.getElementById('chat-inp');
  const text = inp.value.trim();
  if (!text || chatBusy) return;
  inp.value = '';
  chatAsk(text);
}

async function chatAsk(text) {
  if (!text || chatBusy) return;
  const key = await chatGetKey();
  if (!key) {
    chatAddMsg('ai', 'Please enter your <a href="https://openrouter.ai/keys" target="_blank" style="color:var(--cyan)">OpenRouter API key</a> below to enable the chat.');
    document.getElementById('chat-key-row').style.display = 'flex';
    return;
  }
  chatBusy = true;
  document.getElementById('chat-snd').disabled = true;
  chatAddMsg('user', text);
  chatHistory.push({ role: 'user', content: text });
  const typingEl = chatAddTyping();
  try {
    const msgs = [{ role: 'system', content: CHAT_SYSTEM }, ...chatHistory];
    const reply = await _chatFetch(key, msgs);
    chatHistory.push({ role: 'assistant', content: reply });
    typingEl.remove();
    const rendered = (typeof marked !== 'undefined') ? marked.parse(reply) : reply.replace(/\n/g, '<br>');
    chatAddMsg('ai', rendered);
  } catch (err) {
    typingEl.remove();
    chatAddMsg('ai', err.message || 'Could not connect. Please try again.');
  } finally {
    chatBusy = false;
    document.getElementById('chat-snd').disabled = false;
  }
}

function chatAddMsg(role, html) {
  const msgs = document.getElementById('chat-msgs');
  if (!msgs) return;
  const d = document.createElement('div');
  d.className = 'chat-msg ' + role;
  d.innerHTML = '<div class="chat-av">' + (role === 'ai' ? 'AI' : 'You') + '</div><div class="chat-bub">' + html + '</div>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}

function chatAddTyping() {
  const msgs = document.getElementById('chat-msgs');
  const d = document.createElement('div');
  d.className = 'chat-msg ai';
  d.innerHTML = '<div class="chat-av">AI</div><div class="chat-bub"><span class="chat-dot"></span><span class="chat-dot"></span><span class="chat-dot"></span></div>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}

(async function() {
  const k = await chatGetKey().catch(() => '');
  if (!k) {
    const kr = document.getElementById('chat-key-row');
    if (kr) kr.style.display = 'flex';
  }
})();

// ── FLOATING CHAT ──
let _cfHistory = [], _cfBusy = false;

function toggleChatFloat() {
  const p = document.getElementById('chat-float');
  if (!p) return;
  const opening = !p.classList.contains('cf-open');
  p.classList.toggle('cf-open');
  if (opening) setTimeout(() => { const i = document.getElementById('cf-inp'); if (i) i.focus(); }, 260);
}

document.addEventListener('click', function(e) {
  const p = document.getElementById('chat-float');
  if (!p || !p.classList.contains('cf-open')) return;
  const ring = document.querySelector('.chat-fab-ring');
  if (!p.contains(e.target) && !(ring && ring.contains(e.target))) p.classList.remove('cf-open');
});

function cfAddMsg(role, html) {
  const msgs = document.getElementById('cf-msgs');
  if (!msgs) return;
  const d = document.createElement('div');
  d.className = 'cf-msg ' + role;
  d.innerHTML = '<div class="cf-av">'+(role==='ai'?'AI':'You')+'</div><div class="cf-bub">'+html+'</div>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}

function cfAddTyping() {
  const msgs = document.getElementById('cf-msgs');
  const d = document.createElement('div');
  d.className = 'cf-msg ai';
  d.innerHTML = '<div class="cf-av">AI</div><div class="cf-bub"><span class="chat-dot"></span><span class="chat-dot"></span><span class="chat-dot"></span></div>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}

function cfSend() {
  const inp = document.getElementById('cf-inp');
  const text = inp ? inp.value.trim() : '';
  if (!text || _cfBusy) return;
  inp.value = '';
  cfAsk(text);
}

async function cfAsk(text) {
  if (!text || _cfBusy) return;
  const key = await chatGetKey();
  _cfBusy = true;
  const snd = document.getElementById('cf-snd');
  if (snd) snd.disabled = true;
  cfAddMsg('user', text);
  _cfHistory.push({ role: 'user', content: text });
  const t = cfAddTyping();
  try {
    const reply = await _chatFetch(key, [{ role: 'system', content: CHAT_SYSTEM }, ..._cfHistory]);
    _cfHistory.push({ role: 'assistant', content: reply });
    t.remove();
    cfAddMsg('ai', (typeof marked !== 'undefined') ? marked.parse(reply) : reply.replace(/\n/g, '<br>'));
  } catch(err) {
    t.remove();
    cfAddMsg('ai', err.message || 'Could not connect. Please try again.');
  } finally {
    _cfBusy = false;
    if (snd) snd.disabled = false;
  }
}
