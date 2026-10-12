export function initLoader() {
 const loader=document.getElementById('site-loader');
 if(!loader)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let closed=false,timer;
 const close=()=>{if(closed)return;closed=true;clearTimeout(timer);clearTimeout(window.__dmIntroFallback);document.documentElement.classList.remove('intro-pending');document.documentElement.classList.add('system-intro-done');loader.remove();};
 if(motion.matches||location.hash){close();return;}
 const lang=document.documentElement.lang;
 const labels=lang==='pl'?['Strona','Zapytanie','Wiadomość','Dane','Łączymy biznes w system','Porozmawiajmy','Pomiń']:lang==='en'?['Website','Lead','Message','Data','Connecting your business','Let’s talk','Skip']:['Сайт','Заявка','Повідомлення','Дані','Збираємо бізнес у систему','Обговорити проєкт','Пропустити'];
 loader.classList.add('system-intro');
 loader.innerHTML='<div class="system-intro__top"><span>DM<span class="system-accent">.</span> STUDIO</span><button type="button" class="system-skip">'+labels[6]+' ↗</button></div><div class="system-scene" aria-hidden="true"><div class="system-orbit"></div><svg class="system-lines" viewBox="0 0 800 450"><path d="M160 100 L400 220 L650 100 M400 220 L180 350 M400 220 L650 350"/><circle r="4"><animateMotion dur="1.5s" repeatCount="indefinite" path="M160 100 L400 220 L650 350"/></circle><circle r="4"><animateMotion dur="1.8s" repeatCount="indefinite" path="M180 350 L400 220 L650 100"/></circle></svg><div class="system-node node-web"><b>01 / WEB</b><strong>'+labels[0]+'</strong><div class="system-browser"><i></i><i></i><i></i><span></span><em></em></div></div><div class="system-node node-lead"><b>02 / FORM</b><strong>'+labels[1]+'</strong><div class="system-bars"><i></i><i></i><i></i></div></div><div class="system-core">DM<span>WORKFLOW</span></div><div class="system-node node-message"><b>03 / TELEGRAM</b><strong>'+labels[2]+'</strong><div class="system-chat"><span>↗</span><i></i><i></i></div></div><div class="system-node node-data"><b>04 / DATA</b><strong>'+labels[3]+'</strong><div class="system-table"><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div><div class="system-intro__bottom"><p>'+labels[4]+'</p><span>WEB · AUTOMATION · AI</span><a href="#contact" class="system-contact">'+labels[5]+' ↗</a></div>';
 loader.hidden=false;
 loader.querySelector('.system-skip').addEventListener('click',close);
 loader.querySelector('.system-contact').addEventListener('click',close);
 document.addEventListener('keydown',close,{once:true});
 motion.addEventListener('change',e=>{if(e.matches)close();},{once:true});
 timer=setTimeout(close,3100);
}
