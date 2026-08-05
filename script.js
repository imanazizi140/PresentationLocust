(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const current = document.querySelector('#current-slide');
  const progress = document.querySelector('#progress-bar');
  let index = 0;

  document.querySelectorAll('.asset-frame').forEach((frame) => {
    const image = frame.querySelector('img');
    if (!image || !image.getAttribute('src')) frame.classList.add('is-missing');
    else image.addEventListener('error', () => frame.classList.add('is-missing'), { once: true });
  });
  document.querySelectorAll('.brand-logo img').forEach((image) => {
    image.style.display = 'none';
    image.addEventListener('load', () => { image.style.display = 'block'; }, { once: true });
    image.addEventListener('error', () => { image.style.display = 'none'; }, { once: true });
  });

  function showSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    current.textContent = String(index + 1);
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  }

  document.querySelector('#prev').addEventListener('click', () => showSlide(index - 1));
  document.querySelector('#next').addEventListener('click', () => showSlide(index + 1));
  document.querySelector('#fullscreen').addEventListener('click', async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') { event.preventDefault(); showSlide(index + 1); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); showSlide(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); showSlide(0); }
    if (event.key === 'End') { event.preventDefault(); showSlide(slides.length - 1); }
  });
  let touchStartX = 0;
  document.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  document.addEventListener('touchend', (event) => { const delta = event.changedTouches[0].screenX - touchStartX; if (Math.abs(delta) > 45) showSlide(index + (delta < 0 ? 1 : -1)); }, { passive: true });
  showSlide(0);
})();
