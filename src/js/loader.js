export function initLoader(){
 const loader=document.getElementById('site-loader');
 if(!loader)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const cards=[...document.querySelectorAll('.hero__visual .service')];
 let closed=false,timer,landing=false;
 const abort=new AbortController(),clones=[];
 function close(){
  if(closed)return;closed=true;clearTimeout(timer);clearTimeout(window.__dmIntroFallback);abort.abort();
  cards.forEach(c=>{c.style.removeProperty('visibility');c.classList.remove('service-awaiting');});clones.forEach(c=>c.remove());
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
  clone.classList.add('morph-icon-only');
  document.body.append(clone);clones.push(clone);card.classList.add('service-awaiting');card.style.visibility='hidden';
  clone.animate([{opacity:0,transform:'translate('+((i%2?1:-1)*160)+'px,'+(i<2?-70:70)+'px) rotate('+(i%2?15:-15)+'deg) scale(.7)'},{opacity:1,transform:'none'}],{duration:1100,delay:i*90,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
 });
 function land(){
  if(closed||landing)return;landing=true;
  document.documentElement.classList.remove('intro-pending');
  animateHero();
  loader.classList.add('is-landing');
  clones.forEach((clone,i)=>{
   clone.getAnimations().forEach(a=>a.cancel());clone.style.setProperty('padding','0','important');
   const from=clone.getBoundingClientRect(),to=cards[i].querySelector('.service__icon').getBoundingClientRect();
   const animation=clone.animate([{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px',transform:'none'},{left:to.left+'px',top:to.top+'px',width:to.width+'px',height:to.height+'px',transform:'none'}],{duration:1100,delay:i*55,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
   animation.finished.then(()=>{if(!closed){cards[i].style.removeProperty('visibility');cards[i].classList.add('service-text-arrive');cards[i].classList.remove('service-awaiting');clone.remove();}}).catch(()=>{});
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
 initScrollParallax();
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(motion.matches||!('IntersectionObserver' in window))return;
 const targets=[...document.querySelectorAll('.svc__header,.svc-card,.sol__header,.sol-card,.cases-preview__header,.case-card,.blog-section-header,.blog-card,.ct-card,.ct-faq,.footer')];
 let observer;
 const restore=()=>{observer?.disconnect();targets.forEach(el=>el.classList.add('scroll-visible'));};
 try{
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('scroll-visible');observer.unobserve(e.target);}}),{threshold:.06});
  targets.forEach((el,i)=>{el.classList.add('scroll-motion');el.style.setProperty('--scroll-delay',(i%3)*65+'ms');el.style.setProperty('--entry-x',el.matches('.sol-card,.svc-card')?(i%2? '28px':'-28px'):'0px');observer.observe(el);});
  document.addEventListener('focusin',e=>e.target.closest('.scroll-motion')?.classList.add('scroll-visible'));
  motion.addEventListener('change',e=>{if(e.matches)restore();});
 }catch(e){restore();}
}

function animateHero(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const sequence=[
 ['.hero__intro .eyebrow',80],['.hero h1',180],['.hero__description',340],
 ['.hero__buttons',450],['.social-proof',560],['.portrait',220],
 ['.hero__about>h2',650],['.availability',730],['.about__description',820],
 ['.stats>div',950],['.hero__about>.case',1100]
 ];
 sequence.forEach(([selector,delay])=>document.querySelectorAll(selector).forEach((el,i)=>{
  el.animate?.([{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:1050,delay:delay+i*90,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
 }));
 const orbit=document.querySelector('.orbit');
 if(orbit){
  orbit.classList.add('orbit-drawn');
  orbit.innerHTML='<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43" pathLength="1"/></svg>';
  orbit.querySelector('circle').animate([{strokeDashoffset:1,opacity:0},{strokeDashoffset:0,opacity:1}],{duration:1700,delay:1400,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
 }
}

function initScrollParallax(){
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(motion.matches)return;
 const layers=[...document.querySelectorAll('.svc-visual__node,.svc-visual__badge,.svc-visual__stack,.sol-actual-phone,.case-visual__leaf,.case-visual--screenshot')];
 let frame=0;
 const update=()=>{
  frame=0;
  const vh=innerHeight,small=innerWidth<780;
  layers.forEach((el,i)=>{
   const section=el.closest('section'),r=section?.getBoundingClientRect();if(!r||r.bottom<0||r.top>vh)return;
   const progress=Math.max(-1,Math.min(1,(vh*.5-(r.top+r.height*.5))/(vh*.65+r.height*.35)));
   const distance=el.matches('.svc-visual__node,.svc-visual__badge')?65:30;
   const y=progress*distance*(i%2?1:-1)*(small?.35:1);
   el.style.setProperty('--parallax-y',y.toFixed(2)+'px');
   if(el.matches('.svc-visual__node,.case-visual__leaf'))el.style.setProperty('--parallax-angle',(progress*(i%2?8:-8)).toFixed(2)+'deg');
  });
 };
 const request=()=>{if(!frame)frame=requestAnimationFrame(update);};
 const controller=new AbortController();
 layers.forEach(el=>el.classList.add('scroll-parallax'));
 window.addEventListener('scroll',request,{passive:true,signal:controller.signal});
 window.addEventListener('resize',request,{passive:true,signal:controller.signal});
 motion.addEventListener('change',e=>{if(e.matches){controller.abort();cancelAnimationFrame(frame);layers.forEach(el=>{el.classList.remove('scroll-parallax');el.style.removeProperty('--parallax-y');el.style.removeProperty('--parallax-angle');});}});
 request();
}
