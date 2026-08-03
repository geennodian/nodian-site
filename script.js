// ハンバーガーメニュー
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
navOverlay.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => toggleMenu(false))
);

// スクロールで要素をフェードイン表示
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
