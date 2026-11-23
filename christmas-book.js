(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.book-header');
  const hero = document.querySelector('.book-hero');
  const floating = document.getElementById('floating-purchase');
  const purchase = document.getElementById('get-the-book');
  const progress = document.querySelector('.reading-progress');
  const model = document.getElementById('book-model');
  const scene = document.getElementById('book-scene');
  const cinematic = document.querySelector('.cinematic');
  const parallax = document.querySelector('[data-parallax]');
  const year = document.getElementById('book-year');
  if (year) year.textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        reveal.unobserve(entry.target);
      });
    }, {threshold:.08, rootMargin:'0px 0px -25px 0px'});
    document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));
    document.documentElement.classList.add('enhanced');
  }

  let queued = false;
  function updateScroll() {
    const scroll = window.scrollY;
    const page = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', scroll > 45);
    progress.style.transform = `scaleX(${page > 0 ? scroll / page : 0})`;
    const pastHero = hero.getBoundingClientRect().bottom < 90;
    const atPurchase = purchase.getBoundingClientRect().top < window.innerHeight * .75;
    floating.hidden = !(pastHero && !atPurchase);
    if (!reduced.matches && window.innerWidth > 600) {
      const box = cinematic.getBoundingClientRect();
      if (box.bottom > 0 && box.top < window.innerHeight) {
        const offset = (box.top - window.innerHeight / 2) * -.075;
        parallax.style.transform = `translate3d(0,${Math.max(-50,Math.min(50,offset))}px,0)`;
      }
    } else parallax.style.transform = '';
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateScroll); }
  }, {passive:true});
  window.addEventListener('resize', updateScroll, {passive:true});
  reduced.addEventListener('change', updateScroll);
  updateScroll();

  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    scene.addEventListener('pointermove', event => {
      if (reduced.matches) return;
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      model.style.transform = `rotateY(${-17 + x*8}deg) rotateX(${8-y*6}deg) rotateZ(2deg)`;
    });
    scene.addEventListener('pointerleave', () => { model.style.transform = ''; });
  }

  const chapters = {
    arrival:{name:'The art of arrival',page:9,image:'book-assets/page-9.webp',description:'Arches, sculptural consoles and natural textures create a welcome before the first guest steps inside.',alt:'Actual PDF page 9: The Art of Arrival, a foyer with a sculptural console, woven baskets and seasonal greenery'},
    gather:{name:'A room of warmth',page:18,image:'book-assets/page-18.webp',description:'Discover the warmth of woven wall art, layered textiles, timber and a black-and-ivory Christmas tree.',alt:'Actual PDF page 18: A Room of Warmth, an Afro-Bohemian living room with woven textures and a Christmas tree'},
    celebrate:{name:'The festive table',page:28,image:'book-assets/page-28.webp',description:'The collection brings Afro-Bohemian detail to the dining room, with festive tables and a spirit of Ugandan hospitality.',alt:'Actual PDF page 28: The Festive Table, a dining room with woven pendant lights and patterned table settings'},
    retreat:{name:'The gift of rest',page:40,image:'book-assets/page-40.webp',description:'Explore restful bedrooms through sculpted forms, warm lighting, greenery and richly layered black-and-ivory textiles.',alt:'Actual PDF page 40: The Gift of Rest, a bedroom with a sculpted headboard, woven pendants and patterned cushions'},
    escape:{name:'Beyond the arches',page:48,image:'book-assets/page-48.webp',description:'Christmas continues outdoors, with tropical terraces, poolside spaces and places to gather beneath the palms.',alt:'Actual PDF page 48: Beyond the Arches, a pool terrace beside an arched white villa'},
    atelier:{name:'The signature tree',page:55,image:'book-assets/page-55.webp',description:'The Design Atelier brings the details into focus, with guidance on tree styling, materials, balance and presentation.',alt:'Actual PDF page 55: The Signature Tree, four styling notes on form, materials, finishing and photographing the tree'}
  };
  const tabs = [...document.querySelectorAll('.chapter-tab')];
  const panel = document.getElementById('chapter-panel');
  const image = document.getElementById('chapter-image');
  const name = document.getElementById('chapter-name');
  const page = document.getElementById('chapter-page');
  const description = document.getElementById('chapter-description');
  const enlarge = document.getElementById('preview-enlarge');
  const dialog = document.getElementById('preview-dialog');
  const largeImage = document.getElementById('large-preview');
  const dialogTitle = document.getElementById('preview-dialog-title');
  let activeChapter = 'arrival';
  let transitionId = 0;

  async function selectChapter(key, focus = false) {
    const item = chapters[key];
    if (!item) return;
    activeChapter = key;
    const currentTransition = ++transitionId;
    tabs.forEach(tab => {
      const selected = tab.dataset.chapter === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panel.setAttribute('aria-labelledby', 'tab-' + key);
    name.textContent = item.name;
    page.textContent = `From the PDF · Page ${item.page}`;
    description.textContent = item.description;
    enlarge.setAttribute('aria-label', `Enlarge ${key === 'atelier' ? 'Design Atelier' : key.charAt(0).toUpperCase()+key.slice(1)} preview`);
    const next = new Image(); next.src = item.image;
    try { await next.decode(); } catch { /* Keep the normal image loading fallback. */ }
    if (currentTransition !== transitionId) return;
    image.src = item.image; image.alt = item.alt;
    if (!reduced.matches) image.animate([{opacity:.2,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:600,easing:'cubic-bezier(.2,.65,.2,1)'});
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => selectChapter(tab.dataset.chapter));
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index+1)%tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index-1+tabs.length)%tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length-1;
      if (nextIndex === undefined) return;
      event.preventDefault(); selectChapter(tabs[nextIndex].dataset.chapter,true);
    });
  });
  enlarge.addEventListener('click', () => {
    const item = chapters[activeChapter];
    largeImage.src = item.image; largeImage.alt = item.alt;
    dialogTitle.textContent = `${item.name} · Digital PDF page ${item.page}`;
    dialog.showModal();
  });
  document.getElementById('close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => enlarge.focus({preventScroll:true}));

  // Native details remain usable even without JavaScript; animation adds a gentle reveal.
  document.querySelectorAll('.faq-list details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open && !reduced.matches) details.querySelector('div').animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});
    });
  });
})();
