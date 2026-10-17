// ============================================================
// NODIAN — interactions & scroll animations (GSAP + ScrollTrigger)
// GSAPが読み込めない環境・reduced-motion設定時は静的表示にフォールバック
// ============================================================

// ---- ハンバーガーメニュー ----
const menuBtn = document.getElementById('menuBtn');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu(open) {
  const isOpen = open ?? !navOverlay.classList.contains('open');
  navOverlay.classList.toggle('open', isOpen);
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  navOverlay.setAttribute('aria-hidden', String(!isOpen));
}
menuBtn.addEventListener('click', () => toggleMenu());
navOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// ---- ヘッダー背景（スクロールでガラス化） ----
const header = document.getElementById('header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });

// ---- パーティクルネットワーク（ヒーロー背景） ----
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('particles');

if (canvas && !reduced) {
  const ctx = canvas.getContext('2d');
  let w, h, dots = [], raf;
  const DOT_N = () => Math.min(70, Math.floor(innerWidth / 22));

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    dots = Array.from({ length: DOT_N() }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      r: (Math.random() * 1.6 + 0.8) * devicePixelRatio,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    const LINK = 150 * devicePixelRatio;
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
    }
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK) {
          ctx.strokeStyle = `rgba(94, 234, 212, ${0.14 * (1 - dist / LINK)})`;
          ctx.lineWidth = devicePixelRatio;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const d of dots) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }

  resize();
  addEventListener('resize', resize);
  tick();
  // タブ非表示時は停止
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else tick();
  });
}

// ---- GSAPアニメーション ----
if (window.gsap && window.ScrollTrigger && !reduced) {
  gsap.registerPlugin(ScrollTrigger);

  // --- ヒーロータイトル: 1文字ずつスライドイン ---
  const title = document.getElementById('heroTitle');
  title.innerHTML = [...title.textContent].map(c => `<span class="char">${c}</span>`).join('');
  gsap.from('#heroTitle .char', {
    yPercent: 120, opacity: 0, rotateX: -40,
    duration: 1.1, ease: 'power4.out', stagger: 0.07, delay: 0.25,
  });
  gsap.from('.hero .gs-fade', { opacity: 0, y: 24, duration: 1, ease: 'power2.out', stagger: 0.15, delay: 0.9 });

  // --- SVGラインドロー（ヒーローリング: ロード時） ---
  document.querySelectorAll('.hero__ring .draw').forEach((p, i) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(p, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', delay: 0.4 + i * 0.25 });
  });
  gsap.from('.hero__ring .node', { scale: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(2.5)', stagger: 0.2, delay: 1.7 });
  gsap.to('.hero__ring', { y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // --- SVGラインドロー（セクション下線: スクロールイン時） ---
  document.querySelectorAll('.sec-line .draw').forEach(p => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(p, {
      strokeDashoffset: 0, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: p.closest('.sec-head'), start: 'top 78%' },
    });
  });

  // --- 汎用リビール（フェード / スライドイン） ---
  document.querySelectorAll('.gs-fade:not(.hero .gs-fade)').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 82%' },
    });
  });
  gsap.utils.toArray('section').forEach(sec => {
    const ups = sec.querySelectorAll('.gs-up');
    if (!ups.length) return;
    gsap.from(ups, {
      opacity: 0, y: 46, duration: 0.9, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: ups[0], start: 'top 85%' },
    });
  });

  // --- ミッション: スクロールテリング（ピン留め＋スクラブ） ---
  const missionLines = gsap.utils.toArray('.mission-line');
  gsap.timeline({
    scrollTrigger: {
      trigger: '.mission', start: 'top 20%', end: '+=160%',
      pin: true, scrub: 0.6,
    },
  }).to(missionLines, {
    color: 'rgba(233, 242, 247, 1)', stagger: 0.5, duration: 1, ease: 'none',
  });

  // --- カウントアップ ---
  document.querySelectorAll('.count').forEach(el => {
    const target = +el.dataset.count;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.8, ease: 'power3.out',
      snap: { v: 1 },
      onUpdate: () => { el.textContent = Math.round(obj.v); },
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // --- Works: ピン留め＋横スクロール（デスクトップのみ） ---
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    const track = document.getElementById('worksTrack');
    const getX = () => -(track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: getX, ease: 'none',
      scrollTrigger: {
        trigger: '.works', start: 'top top',
        end: () => `+=${track.scrollWidth - innerWidth}`,
        pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    // パネル内の画像を少しパララックス
    gsap.utils.toArray('.works-panel__img img').forEach(img => {
      gsap.fromTo(img, { xPercent: -6 }, {
        xPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
    return () => {};
  });

  // --- Valueカードスタック: 重なる際に奥のカードを縮小 ---
  const valueCards = gsap.utils.toArray('.value-card');
  valueCards.forEach((card, i) => {
    if (i === valueCards.length - 1) return;
    gsap.to(card, {
      scale: 0.94, opacity: 0.55, filter: 'blur(1.5px)', transformOrigin: 'center top', ease: 'none',
      scrollTrigger: {
        trigger: valueCards[i + 1], start: 'top 80%', end: 'top 20%', scrub: true,
      },
    });
  });

  // --- パララックス（ブロブ / グロウ） ---
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.to(el, {
      yPercent: +el.dataset.parallax, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // --- パララックス（画像: scale1.15の余白を利用して縦移動） ---
  document.querySelectorAll('[data-parallax-img]').forEach(img => {
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // --- Statement: 縦書きテキストをゆっくり浮上 ---
  gsap.from('.statement__text', {
    opacity: 0, y: 60, duration: 1.4, ease: 'power2.out',
    scrollTrigger: { trigger: '.statement', start: 'top 70%' },
  });
} else {
  // フォールバック: すべて表示（アニメーションなし）
  document.querySelectorAll('.mission-line').forEach(el => (el.style.color = '#e9f2f7'));
  document.querySelectorAll('.count').forEach(el => (el.textContent = el.dataset.count));
}
