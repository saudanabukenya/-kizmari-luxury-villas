"use strict";
const menuButton=document.getElementById('menu-toggle');
const navigation=document.getElementById('navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Menu +'}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';navigation.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'Close −':'Menu +'});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('open')){closeMenu();menuButton.focus()}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu()});
const wideScreen=window.matchMedia('(min-width:901px)');wideScreen.addEventListener('change',event=>{if(event.matches)closeMenu()});
const dialog=document.getElementById('gallery-dialog');
if(dialog){
 const galleryItems=Array.from(document.querySelectorAll('.gallery-item'));
 const filters=Array.from(document.querySelectorAll('.filter'));
 filters.forEach(button=>button.addEventListener('click',()=>{const category=button.dataset.filter;filters.forEach(filter=>filter.setAttribute('aria-pressed',String(filter===button)));galleryItems.forEach(item=>{item.hidden=category!=='all'&&item.dataset.category!==category});const count=galleryItems.filter(item=>!item.hidden).length;document.getElementById('gallery-count').textContent=count+' design '+(count===1?'view':'views')}));
 let activeItems=galleryItems,activeIndex=0,opener=null;
 function showImage(index){activeIndex=(index+activeItems.length)%activeItems.length;const item=activeItems[activeIndex],source=item.querySelector('img'),image=document.getElementById('dialog-image');image.src=source.currentSrc||source.src;image.alt=source.alt;document.getElementById('dialog-title').textContent=item.dataset.title;document.getElementById('dialog-position').textContent=(activeIndex+1)+' / '+activeItems.length+' · Design gallery'}
 galleryItems.forEach(item=>item.addEventListener('click',()=>{opener=item;activeItems=galleryItems.filter(view=>!view.hidden);showImage(activeItems.indexOf(item));dialog.showModal();document.body.classList.add('modal-open')}));
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(opener)opener.focus({preventScroll:true})});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()}});
 document.getElementById('gallery-prev').addEventListener('click',()=>showImage(activeIndex-1));document.getElementById('gallery-next').addEventListener('click',()=>showImage(activeIndex+1));
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showImage(activeIndex+1)}if(event.key==='ArrowLeft'){event.preventDefault();showImage(activeIndex-1)}});
}
document.getElementById('copyright-year').textContent=new Date().getFullYear();
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduceMotion.matches&&'IntersectionObserver' in window){
 const revealTargets=document.querySelectorAll('.picture-nav-card,.section-intro,.space-card,.story-visual,.story-copy,.gallery-item,.art-grid>img,.art-copy,.amenity,.contact-grid>div,.faq>div,.intro>div');
 const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -24px 0px'});
 document.documentElement.classList.add('motion-ready');
 revealTargets.forEach((element,index)=>{element.setAttribute('data-reveal','');if(element.classList.contains('gallery-item')||element.classList.contains('amenity'))element.style.setProperty('--reveal-delay',(index%3)*65+'ms');revealObserver.observe(element)});
 reduceMotion.addEventListener('change',event=>{if(event.matches){document.documentElement.classList.remove('motion-ready');revealObserver.disconnect()}});
}
const initialView=new URLSearchParams(window.location.search).get('view');if(initialView&&dialog){const initialFilter=document.querySelector('.filter[data-filter="'+(['interiors','outdoors','details'].includes(initialView)?initialView:'all')+'"]');if(initialFilter)initialFilter.click()}
const header=document.querySelector('.site-header');
const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');header.append(progress);
const topButton=document.createElement('button');topButton.type='button';topButton.className='back-top';topButton.setAttribute('aria-label','Back to top');topButton.textContent='Top';topButton.hidden=true;document.body.append(topButton);topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduceMotion.matches?'instant':'smooth'}));
let ticking=false;
function updateScroll(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform='scaleX('+(max>0?Math.min(1,Math.max(0,window.scrollY/max)):0)+')';header.classList.toggle('is-scrolled',window.scrollY>25);topButton.hidden=window.scrollY<600;ticking=false}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true}},{passive:true});window.addEventListener('resize',updateScroll);updateScroll();
