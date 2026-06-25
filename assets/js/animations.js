// ── ANIMATIONS ──

// 1. Scroll reveal
(function(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.classList.contains('reveal-stagger')) {
        el.classList.add('revealed');
        [...el.children].forEach((ch, i) => {
          setTimeout(() => { ch.style.opacity='1'; ch.style.transform='none'; }, i * 90);
        });
      } else {
        el.classList.add('revealed');
      }
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin:'0px 0px -40px 0px' });

  function observe() {
    document.querySelectorAll('.reveal,.reveal-stagger').forEach(el => io.observe(el));
  }
  observe();
  const sc = document.getElementById('scroll');
  if (sc) sc.addEventListener('scroll', observe, { once: true });
})();

// 2. Typewriter role text
(function(){
  const verbEl = document.getElementById('tw-verb');
  const objEl  = document.getElementById('tw-obj');
  if (!verbEl || !objEl) return;
  const phrases = [
    { verb:'build ',    obj:'distributed systems.' },
    { verb:'architect ',obj:'microservices at scale.' },
    { verb:'ship ',     obj:'AI-driven backends.' },
    { verb:'optimize ', obj:'for performance & cost.' },
    { verb:'design ',   obj:'cloud-native solutions.' },
  ];
  let pi=0, ci=0, deleting=false;
  function tick() {
    const {verb,obj} = phrases[pi];
    const full = verb+obj, vl = verb.length;
    if (!deleting) {
      ci++;
      verbEl.textContent = full.slice(0, Math.min(ci,vl));
      objEl.textContent  = full.slice(vl, Math.max(ci,vl));
      if (ci>=full.length){ setTimeout(()=>{ deleting=true; }, 1800); setTimeout(tick,1900); return; }
    } else {
      ci--;
      verbEl.textContent = full.slice(0, Math.min(ci,vl));
      objEl.textContent  = full.slice(vl, Math.max(ci,vl));
      if (ci<=0){ deleting=false; pi=(pi+1)%phrases.length; setTimeout(tick,380); return; }
    }
    setTimeout(tick, deleting ? 28 : 52);
  }
  setTimeout(tick, 1200);
})();

// 3. Counter animation
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (!e.isIntersecting) return;
      const numEl = e.target.querySelector('.stat-n');
      if (!numEl) return;
      const m = numEl.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      const target=parseInt(m[1]), suf=m[2];
      let cur=0;
      e.target.classList.add('counted');
      const iv=setInterval(()=>{
        cur=Math.min(cur+Math.ceil(target/30),target);
        numEl.textContent=cur+suf;
        if(cur>=target) clearInterval(iv);
      },35);
      io.unobserve(e.target);
    });
  },{ threshold:0.5 });
  document.querySelectorAll('.stat-card').forEach(c=>io.observe(c));
})();

// 4. 3D tilt on project cards
(function(){
  document.querySelectorAll('.proj').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-0.5;
      const y=(e.clientY-r.top)/r.height-0.5;
      card.style.transform=`perspective(700px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
  });
})();

// 5. Staggered chip entrance
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.chip').forEach((ch,i)=>{
        setTimeout(()=>{ ch.style.opacity='1'; ch.style.transform='none'; }, i*55);
      });
      e.target.classList.add('chipped');
      io.unobserve(e.target);
    });
  },{ threshold:0.2 });
  document.querySelectorAll('.chips').forEach(g=>io.observe(g));
})();
