(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Section entrances: each [data-reveal] block, once.
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in'));
  }

  // The viewfinder: technique, style and frame change independently.
  const vf = document.getElementById('viewfinder');
  const photo = document.getElementById('vf-photo');
  const coach = document.getElementById('coach-line');
  if (vf && photo && coach) {
    // Coaching lines are the app's own English strings (core/localization CoachingMessages.kt).
    const techniques = {
      fashion: { src: 'assets/img/fashion.jpg', w: 1122, h: 1402, cue: 'Distance', line: 'Keep both shoes in frame', alt: 'Sample scene for Long-Leg Fashion: a woman in wide trousers in front of a stone building.' },
      portrait: { src: 'assets/img/portrait.jpg', w: 1086, h: 1448, cue: 'Perspective', line: 'Keep camera at eye level', alt: 'Sample scene for Natural Portrait: a smiling woman in a cream sweater.' },
      street: { src: 'assets/img/street.jpg', w: 941, h: 1672, cue: 'Framing', line: 'Leave room for movement', alt: 'Sample scene for Street Candid: a person crossing a city street.' },
      group: { src: 'assets/img/group.jpg', w: 1086, h: 1448, cue: 'Framing', line: 'Keep every face in the frame', alt: 'Sample scene for Group Portrait: four friends together.' },
      architecture: { src: 'assets/img/architecture.jpg', w: 1400, h: 1917, cue: 'Level', line: 'Hold the phone more upright to keep lines straight', alt: 'Six windows on a modern building facade.' },
    };
    const state = { technique: 'fashion', style: 'original', frame: '0.8' };
    let touched = false;

    const setPressed = (axis, value) => {
      document.querySelectorAll(`.controls__group[data-axis="${axis}"] .chip`).forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.value === value));
      });
    };
    const setLive = (axis) => {
      document.querySelectorAll('.controls__group').forEach((g) => g.classList.toggle('is-live', g.dataset.axis === axis));
    };
    const apply = (axis, value) => {
      if (state[axis] === value) return;
      state[axis] = value;
      setPressed(axis, value);
      if (axis === 'technique') {
        const t = techniques[value];
        const swap = () => {
          photo.src = t.src; photo.width = t.w; photo.height = t.h; photo.alt = t.alt;
          coach.innerHTML = `<b>${t.cue}</b>${t.line}`;
          photo.classList.remove('is-swapping');
        };
        if (reduce) swap(); else { photo.classList.add('is-swapping'); setTimeout(swap, 200); }
      } else if (axis === 'style') {
        vf.dataset.style = value;
      } else if (axis === 'frame') {
        vf.style.setProperty('--r', value);
      }
    };

    document.querySelectorAll('.controls__group').forEach((group) => {
      const axis = group.dataset.axis;
      group.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        touched = true;
        setLive(axis);
        apply(axis, chip.dataset.value);
      });
    });

    // On wide screens the stage is pinned; scrolling through it changes one axis at a time
    // until the visitor takes over with a tap.
    const stages = {
      technique: () => { apply('style', 'original'); apply('frame', '0.8'); apply('technique', 'fashion'); },
      style: () => { apply('technique', 'fashion'); apply('frame', '0.8'); apply('style', 'street'); },
      frame: () => { apply('technique', 'fashion'); apply('style', 'street'); apply('frame', '0.5625'); },
    };
    const wide = window.matchMedia('(min-width: 960px)');
    if ('IntersectionObserver' in window) {
      const markers = new IntersectionObserver((entries) => {
        if (!wide.matches || touched) return;
        for (const e of entries) {
          if (e.isIntersecting) {
            const s = e.target.dataset.stage;
            setLive(s);
            stages[s]();
          }
        }
      }, { rootMargin: '-50% 0px -50% 0px' });
      document.querySelectorAll('.showcase__markers span').forEach((m) => {
        m.style.height = '33%';
        markers.observe(m);
      });
    }
  }

  // Questions: one answer pane on wide screens, an accordion on phones.
  const items = [...document.querySelectorAll('.faq__item')];
  const pane = document.getElementById('faq-pane');
  if (items.length && pane) {
    const wide = window.matchMedia('(min-width: 900px)');
    const select = (idx, fromHover) => {
      items.forEach((item, i) => {
        const q = item.querySelector('.faq__q');
        const a = item.querySelector('.faq__a');
        const on = i === idx;
        q.setAttribute('aria-expanded', String(on));
        if (!wide.matches) a.hidden = !on;
      });
      if (wide.matches) {
        const html = items[idx].querySelector('.faq__a').innerHTML;
        if (pane.innerHTML === html) return;
        if (reduce || !fromHover) { pane.innerHTML = html; return; }
        pane.classList.add('is-swapping');
        setTimeout(() => { pane.innerHTML = html; pane.classList.remove('is-swapping'); }, 150);
      }
    };
    const layout = () => {
      const current = items.findIndex((it) => it.querySelector('.faq__q').getAttribute('aria-expanded') === 'true');
      items.forEach((it) => { it.querySelector('.faq__a').hidden = false; });
      select(current < 0 ? 0 : current, false);
    };
    items.forEach((item, i) => {
      const q = item.querySelector('.faq__q');
      q.addEventListener('click', () => {
        if (!wide.matches && q.getAttribute('aria-expanded') === 'true') {
          q.setAttribute('aria-expanded', 'false');
          item.querySelector('.faq__a').hidden = true;
          return;
        }
        select(i, false);
      });
      q.addEventListener('mouseenter', () => { if (wide.matches) select(i, true); });
      q.addEventListener('focus', () => { if (wide.matches) select(i, true); });
    });
    wide.addEventListener('change', layout);
    layout();
  }
})();
