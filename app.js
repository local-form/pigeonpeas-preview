const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const toggle=q('.menu-toggle'),mobileNav=q('#mobile-nav');
function setInert(v){qa('main,.site-footer,.mobile-actions').forEach(el=>el.inert=v);}
function closeNav(){if(!toggle)return;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');mobileNav.hidden=true;document.documentElement.classList.remove('nav-open');setInert(false);}
if(toggle){toggle.addEventListener('click',()=>{const o=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!o));toggle.setAttribute('aria-label',o?'Open navigation':'Close navigation');mobileNav.hidden=o;document.documentElement.classList.toggle('nav-open',!o);setInert(!o);});
  qa('a',mobileNav).forEach(a=>a.addEventListener('click',closeNav));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeNav();toggle.focus();}});
  matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeNav();});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header')&&!mobileNav.hidden)closeNav();});}
qa('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}}),{threshold:.1});
  qa('.card,.review-grid figure,[data-reveal]').forEach(el=>{el.classList.add('reveal');obs.observe(el);});}
// open/closed status (America/New_York). Fri & Sat 11am-8pm, closed Sun-Thu
(function(){
  const OPEN=11*60,CLOSE=20*60,DAYS=[5,6];
  const dn=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date()),g=t=>p.find(x=>x.type===t).value;
  const day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=+g('hour')*60+ +g('minute');
  qa('[data-hours] [data-days]').forEach(r=>{if(r.dataset.days.split(',').map(Number).includes(day))r.classList.add('is-today');});
  const st=q('#open-status'),txt=q('#open-text');if(!st)return;
  if(DAYS.includes(day)&&now>=OPEN&&now<CLOSE){st.classList.add('is-open');txt.textContent='Open now · until 8 pm';return;}
  st.classList.add('is-closed');
  if(DAYS.includes(day)&&now<OPEN){txt.textContent='Closed now · opens at 11 am today';return;}
  for(let i=1;i<=7;i++){const d=(day+i)%7;if(DAYS.includes(d)){txt.textContent='Closed now · opens '+(i===1?'tomorrow':dn[d])+' at 11 am';return;}}
})();
(function(){const bar=q('.mobile-actions'),cta=q('.hero .action-row');if(!bar||!cta)return;document.documentElement.classList.add('has-bar');
  if('IntersectionObserver'in window){new IntersectionObserver(([e])=>bar.classList.toggle('is-shown',!e.isIntersecting&&e.boundingClientRect.top<0),{threshold:0}).observe(cta);}else bar.classList.add('is-shown');})();

// reveal-failsafe: never leave content hidden if the scroll observer doesn't fire
setTimeout(()=>document.querySelectorAll('.reveal:not(.is-visible)').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight*1.5)el.classList.add('is-visible');}),1500);
addEventListener('scroll',()=>document.querySelectorAll('.reveal:not(.is-visible)').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)el.classList.add('is-visible');}),{passive:true});

// stagger siblings by .08s (standard)
(()=>{const n=new Map();document.querySelectorAll('.reveal').forEach(e=>{const p=e.parentElement,i=n.get(p)||0;e.style.setProperty('--d',i*.08+'s');n.set(p,i+1);});})(); /* h2[data-reveal] */

// Local Form request form (shared across previews): reads the request back and sends nothing.
document.querySelectorAll('form[data-lf-request]').forEach(form => {
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  form.querySelectorAll('input[type=date]').forEach(d => d.min = today.toISOString().slice(0, 10));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const parts = [...form.querySelectorAll('[data-sum]')].map(el => {
      if (el.type === 'radio') return el.checked ? el.value : '';
      let v = el.value.trim(); if (!v) return '';
      if (el.type === 'date') v = new Date(v + 'T00:00').toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
      return el.dataset.sum.replace('%', v);
    }).filter(Boolean);
    const name = (form.elements.name?.value || '').trim(), done = form.querySelector('.lf-done'), b = document.createElement('b'), p = document.createElement('span');
    b.textContent = `Your request: ${parts.join(' · ')}${name ? ` (for ${name})` : ''}`;
    p.textContent = form.dataset.lfConfirm;
    done.replaceChildren(b, p); done.hidden = false; done.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  });
});
