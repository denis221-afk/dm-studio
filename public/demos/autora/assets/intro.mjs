export function setupIntro({video,root,groups,skip,toggle,motion,saveData=false,doc,win,schedule=setTimeout,cancel=clearTimeout}){
 let revealed=false,deadline;
 const finish=()=>{if(revealed)return;revealed=true;cancel(deadline);cancel(win.__autoraIntroFallback);groups.forEach(el=>{el.inert=false;});root.classList.remove('intro-playing');root.classList.add('intro-complete');skip.hidden=true;};
 const pause=()=>{video.pause();toggle.setAttribute('aria-pressed','true');toggle.textContent='▶';toggle.setAttribute('aria-label','Відтворити відео');};
 const fail=()=>{pause();finish();};
 video.loop=false;
 if(motion.matches||saveData||!root.classList.contains('intro-playing')){video.removeAttribute('autoplay');pause();finish();}else{
  groups.forEach(el=>{el.inert=true;});skip.hidden=false;
  deadline=schedule(fail,10000);
  if(video.ended)finish();else video.play().catch(fail);
 }
 video.addEventListener('ended',()=>{pause();finish();},{once:true});
 video.addEventListener('error',fail,{once:true});
 skip.addEventListener('click',()=>{pause();finish();});
 toggle.addEventListener('click',()=>{if(video.paused){video.play().then(()=>{toggle.setAttribute('aria-pressed','false');toggle.textContent='Ⅱ';toggle.setAttribute('aria-label','Зупинити відео');}).catch(fail);}else{pause();finish();}});
 motion.addEventListener?.('change',e=>{if(e.matches){pause();finish();}});
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden){pause();finish();}});
 doc.addEventListener('keydown',e=>{if(e.key==='Escape'){pause();finish();}});
 doc.querySelector('.skip')?.addEventListener('focus',finish);
 return {finish};
}
