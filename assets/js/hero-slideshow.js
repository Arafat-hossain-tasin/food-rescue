/* A shuffled deck: every story appears once before a new automatic round. */
const HERO_STORIES = [
  { src: 'assets/images/community-detail.webp', en: 'A warm meal, passed with care', bn: 'খাবারের সঙ্গে যত্নও পৌঁছাক' },
  { src: 'assets/images/stories/02-community-kitchen.png', en: 'A meal made together', bn: 'একসঙ্গে রান্না, সবার জন্য খাবার' },
  { src: 'assets/images/stories/03-bicycle-delivery.png', en: 'Care travels a little further', bn: 'যত্ন পৌঁছে যাক আরও একটু দূরে' },
  { src: 'assets/images/stories/04-bakery-sharing.png', en: 'Fresh bread, a new table', bn: 'তাজা রুটি, নতুন ঠিকানা' },
  { src: 'assets/images/stories/05-family-table.png', en: 'There is room for everyone', bn: 'সবার জন্য থাকুক একটু জায়গা' },
  { src: 'assets/images/stories/06-farmers-market.png', en: 'A basket full of possibility', bn: 'এক ঝুড়ি সবজিতে অনেক সম্ভাবনা' },
  { src: 'assets/images/stories/07-riverside-handover.png', en: 'From one neighbour to another', bn: 'এক প্রতিবেশীর হাত থেকে আরেকজনের হাতে' },
  { src: 'assets/images/stories/08-tiffin-packing.png', en: 'Packed with a little extra care', bn: 'খাবারের সঙ্গে থাকুক একটু বাড়তি যত্ন' },
  { src: 'assets/images/stories/09-neighbour-doorstep.png', en: 'A small knock, a kind gesture', bn: 'দরজায় কড়া, পাশে থাকার বার্তা' },
  { src: 'assets/images/stories/10-evening-volunteers.png', en: 'Many hands, one shared purpose', bn: 'অনেক হাত, পাশে থাকার এক ইচ্ছে' },
  { src: 'assets/images/stories/11-rainy-day-delivery.png', en: 'Kindness finds its way', bn: 'বৃষ্টি পেরিয়েও পৌঁছে যাক ভালোবাসা' },
  { src: 'assets/images/stories/12-courtyard-meal.png', en: 'Good food brings us closer', bn: 'ভালো খাবার মানুষকে কাছে আনে' }
];

function shuffleStoryDeck(count, last = -1) {
  const deck = Array.from({ length: count }, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  if (deck.length > 1 && deck[0] === last) [deck[0], deck[1]] = [deck[1], deck[0]];
  return deck;
}

const galleryArrow = direction => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${direction === 'left' ? 'm14 6-6 6 6 6M8 12h12' : 'm10 6 6 6-6 6M4 12h12'}"/></svg>`;

function heroSlideshowMarkup() {
  return `<section class="hero-frame hero-gallery" id="hero-gallery" aria-roledescription="carousel" aria-label="${b('Twelve stories of sharing','ভাগাভাগির বারোটি গল্প')}">
    <button class="gallery-stage" type="button" aria-label="${b('Show the next picture','পরের ছবি দেখুন')}" aria-describedby="gallery-caption">
      <img class="gallery-image is-current" src="${HERO_STORIES[0].src}" alt="" width="840" height="720" fetchpriority="high" draggable="false">
      <img class="gallery-image" alt="" width="840" height="720" decoding="async" draggable="false" hidden>
      <span class="gallery-click-hint" aria-hidden="true">${b('Click for the next story','ছবিতে চাপ দিন, পরের গল্প দেখুন')} ${galleryArrow('right')}</span>
    </button>
    <div class="gallery-details"><p id="gallery-caption">${b(HERO_STORIES[0].en,HERO_STORIES[0].bn)}</p></div>
    <div class="gallery-progress" aria-hidden="true"><span></span></div>
    <span class="gallery-announcement" aria-live="polite" aria-atomic="true"></span>
  </section>`;
}

class HeroSlideshow {
  constructor(root, translate) {
    this.root = root;
    this.translate = translate;
    this.images = [...root.querySelectorAll('.gallery-image')];
    this.stage = root.querySelector('.gallery-stage');
    this.caption = root.querySelector('#gallery-caption');
    this.announcement = root.querySelector('.gallery-announcement');
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.paused = this.motion.matches;
    this.alive = true;
    this.inView = true;
    this.current = 0;
    this.position = 0;
    this.activeLayer = 0;
    this.order = [0, ...shuffleStoryDeck(HERO_STORIES.length).filter(i => i !== 0)];
    this.history = [];
    this.cache = new Map();
    this.failed = new Set();
    this.listeners = [];
    this.timer = null;
    this.transitionTimer = null;
    this.transitionResolve = null;
    this.busy = false;
    this.queued = null;
    this.suppressClickUntil = 0;

    this.listen(this.stage, 'click', () => { if (Date.now() > this.suppressClickUntil) this.navigate('next', true); });
    this.listen(root, 'keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); this.navigate(event.key === 'ArrowRight' ? 'next' : 'previous', true);
      }
    });
    this.listen(this.stage, 'pointerdown', event => { this.pointerStart = { x: event.clientX, y: event.clientY }; });
    this.listen(this.stage, 'pointercancel', () => { this.pointerStart = null; });
    this.listen(this.stage, 'pointerup', event => {
      if (!this.pointerStart) return;
      const dx = event.clientX - this.pointerStart.x, dy = event.clientY - this.pointerStart.y;
      this.pointerStart = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        this.suppressClickUntil = Date.now() + 400;
        this.navigate(dx < 0 ? 'next' : 'previous', true);
      }
    });
    this.listen(document, 'visibilitychange', () => this.schedule());
    this.listen(this.motion, 'change', () => {
      this.paused = this.motion.matches;
      this.schedule();
    });
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => { this.inView = entries[0].isIntersecting; this.schedule(); }, { threshold: .08 });
      this.observer.observe(root);
    }
    this.schedule();
    this.preloadNext();
  }

  listen(target, event, handler) {
    target.addEventListener(event, handler);
    this.listeners.push(() => target.removeEventListener(event, handler));
  }

  load(index) {
    if (!this.cache.has(index)) {
      const promise = new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Image unavailable'));
        image.src = HERO_STORIES[index].src;
      });
      this.cache.set(index,promise);
    }
    return this.cache.get(index);
  }

  preloadNext() {
    if (!this.alive) return;
    const next = this.order[this.position + 1];
    if (next !== undefined) this.load(next).catch(() => {});
  }

  schedule() {
    clearTimeout(this.timer);
    this.timer = null;
    this.root.classList.remove('gallery-running');
    if (!this.alive || this.paused || this.busy || document.hidden || !this.inView) return;
    void this.root.offsetWidth;
    this.root.classList.add('gallery-running');
    this.timer = setTimeout(() => this.navigate('next',false),5000);
  }

  nextIndex() {
    this.position++;
    if (this.position >= this.order.length) {
      this.order = shuffleStoryDeck(HERO_STORIES.length,this.current);
      this.position = 0;
    }
    return this.order[this.position];
  }

  async navigate(action, manual = false) {
    if (!this.alive) return;
    if (this.busy) { this.queued = { action, manual }; return; }
    let index;
    if (action === 'previous') {
      index = this.history.pop();
      if (index === undefined) index = this.order[(this.position + this.order.length - 1) % this.order.length];
      this.position = this.order.indexOf(index);
    } else if (action === 'next') {
      index = this.nextIndex();
    } else {
      index = action;
      this.position = this.order.indexOf(index);
    }
    if (index === this.current) { this.schedule(); return; }
    this.busy = true;
    this.schedule();
    this.stage.setAttribute('aria-busy','true');

    let ready = false;
    for (let attempt = 0; attempt < HERO_STORIES.length; attempt++) {
      try { await this.load(index); ready = true; break; }
      catch (error) { this.failed.add(index); index = this.nextIndex(); }
      if (!this.alive) return;
    }
    if (!this.alive) return;
    if (!ready) {
      this.paused = true; this.busy = false; this.queued = null;
      this.stage.setAttribute('aria-busy','false');
      this.announcement.textContent = this.translate('Pictures could not load. Please try again later.','ছবিগুলো লোড হয়নি। একটু পরে আবার চেষ্টা করুন।');
      return;
    }

    if (action !== 'previous') { this.history.push(this.current); if (this.history.length > 48) this.history.shift(); }
    const outgoing = this.images[this.activeLayer];
    this.activeLayer = 1 - this.activeLayer;
    const incoming = this.images[this.activeLayer];
    incoming.src = HERO_STORIES[index].src;
    incoming.hidden = false;
    incoming.classList.remove('is-current');
    void incoming.offsetWidth;
    incoming.classList.add('is-current');
    outgoing.classList.remove('is-current');
    this.current = index;
    const story = HERO_STORIES[index];
    this.caption.textContent = this.translate(story.en,story.bn);
    if (manual) this.announcement.textContent = this.caption.textContent;
    this.stage.setAttribute('aria-busy','false');

    if (!this.motion.matches) await new Promise(resolve => {
      this.transitionResolve = resolve;
      this.transitionTimer = setTimeout(resolve,650);
    });
    if (!this.alive) return;
    this.transitionResolve = null;
    outgoing.hidden = true;
    this.busy = false;
    this.preloadNext();
    if (this.queued) {
      const queued = this.queued; this.queued = null;
      this.navigate(queued.action,queued.manual);
    } else this.schedule();
  }

  destroy() {
    this.alive = false;
    clearTimeout(this.timer);
    clearTimeout(this.transitionTimer);
    if (this.transitionResolve) this.transitionResolve();
    this.listeners.forEach(remove => remove());
    if (this.observer) this.observer.disconnect();
    this.cache.clear();
    this.queued = null;
  }
}

let activeHeroSlideshow = null;
function stopHeroSlideshow() {
  if (activeHeroSlideshow) activeHeroSlideshow.destroy();
  activeHeroSlideshow = null;
}
function startHeroSlideshow() {
  stopHeroSlideshow();
  const root = document.getElementById('hero-gallery');
  if (root) activeHeroSlideshow = new HeroSlideshow(root,b);
}
