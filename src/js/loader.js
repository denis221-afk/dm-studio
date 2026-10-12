export function initLoader(){
 const loader=document.getElementById('site-loader');
 if(!loader)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const cards=[...document.querySelectorAll('.hero__visual .service')];
 let closed=false,timer,landing=false;
 const abort=new AbortController(),clones=[];
 function close(){
  if(closed)return;closed=true;clearTimeout(timer);clearTimeout(window.__dmIntroFallback);abort.abort();
  cards.forEach(c=>c.style.removeProperty('visibility'));clones.forEach(c=>c.remove());
  document.documentElement.classList.remove('intro-pending');document.documentElement.classList.add('system-intro-done');loader.remove();
 }
 if(motion.matches||location.hash||cards.length!==4){close();return;}
 clearTimeout(window.__dmIntroFallback);
 timer=setTimeout(close,5200);
 loader.classList.add('system-intro','system-morph');
 const lang=document.documentElement.lang;
 const copy=lang==='en'?['Connecting your business','Skip','Let’s talk']:lang==='pl'?['Łączymy biznes w system','Pomiń','Porozmawiajmy']:['Збираємо бізнес у систему','Пропустити','Обговорити проєкт'];
 loader.innerHTML='<div class="system-intro__top"><span>DM<span class="system-accent">.</span> STUDIO</span><button type="button" class="system-skip">'+copy[1]+' ↗</button></div><div class="system-scene"><div class="system-orbit"></div><svg class="system-lines" viewBox="0 0 800 450" aria-hidden="true"><path d="M160 100 L400 220 L650 100 M400 220 L180 350 M400 220 L650 350"/></svg><div class="system-core" aria-hidden="true">DM<span>STUDIO</span></div></div><div class="system-intro__bottom"><p>'+copy[0]+'</p><span>WEB · AUTOMATION · AI</span><a href="#contact" class="system-contact">'+copy[2]+' ↗</a></div>';
 loader.hidden=false;
 const scene=loader.querySelector('.system-scene').getBoundingClientRect();
 cards.forEach((card,i)=>{
  const clone=card.cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-hidden','true');clone.classList.add('morph-card');
  const r=card.getBoundingClientRect(),mobile=innerWidth<600;
  const width=Math.min(r.width||220,mobile?150:240),height=Math.min(r.height||120,150);
  const left=scene.left+scene.width*(i%2?.72:.08),top=scene.top+scene.height*(i<2?.08:.65);
  Object.assign(clone.style,{position:'fixed',left:left+'px',top:top+'px',right:'auto',bottom:'auto',width:width+'px',height:height+'px',margin:'0',zIndex:'10001',visibility:'visible',pointerEvents:'none',boxSizing:'border-box'});
  document.body.append(clone);clones.push(clone);card.style.visibility='hidden';
  clone.animate([{opacity:0,transform:'translate('+((i%2?1:-1)*160)+'px,'+(i<2?-70:70)+'px) rotate('+(i%2?15:-15)+'deg) scale(.7)'},{opacity:1,transform:'none'}],{duration:1100,delay:i*90,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
 });
 function land(){
  if(closed||landing)return;landing=true;
  document.documentElement.classList.remove('intro-pending');
  loader.classList.add('is-landing');
  clones.forEach((clone,i)=>{
   clone.getAnimations().forEach(a=>a.cancel());
   const from=clone.getBoundingClientRect(),to=cards[i].getBoundingClientRect();
   const animation=clone.animate([{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px',transform:'none'},{left:to.left+'px',top:to.top+'px',width:to.width+'px',height:to.height+'px',transform:'none'}],{duration:1100,delay:i*55,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
   animation.finished.then(()=>{if(!closed){cards[i].style.removeProperty('visibility');clone.remove();}}).catch(()=>{});
  });
  clearTimeout(timer);timer=setTimeout(close,1400);
 }
 loader.querySelector('.system-skip').addEventListener('click',close,{signal:abort.signal});
 loader.querySelector('.system-contact').addEventListener('click',close,{signal:abort.signal});
 document.addEventListener('keydown',close,{signal:abort.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)close();},{signal:abort.signal});
 motion.addEventListener('change',e=>{if(e.matches)close();},{signal:abort.signal});
 window.addEventListener('resize',close,{signal:abort.signal});
 setTimeout(land,1800);
}

export function initScrollMotion(){
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(motion.matches||!('IntersectionObserver' in window))return;
 const targets=[...document.querySelectorAll('main > section:not(.hero),.svc-card,.sol-header,.solution-card,.cases-header,.case-card,.ct-header,.ct-panel,.ct-faq,.blog-card')];
 let observer;
 const restore=()=>{observer?.disconnect();targets.forEach(el=>el.classList.add('scroll-visible'));};
 try{
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('scroll-visible');observer.unobserve(e.target);}}),{threshold:.06});
  targets.forEach((el,i)=>{el.classList.add('scroll-motion');el.style.setProperty('--scroll-delay',(i%3)*65+'ms');observer.observe(el);});
  document.addEventListener('focusin',e=>e.target.closest('.scroll-motion')?.classList.add('scroll-visible'));
  motion.addEventListener('change',e=>{if(e.matches)restore();});
 }catch(e){restore();}
}
