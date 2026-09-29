(function () {
  const container = document.getElementById('memes');
  const memes = Array.isArray(window.MEMES) ? window.MEMES : [];

  if (memes.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'memes-empty';
    empty.textContent = 'Memes loading… (the good stuff is on its way)';
    container.appendChild(empty);
    return;
  }

  memes.forEach(function (meme, i) {
    const figure = document.createElement('figure');
    figure.className = 'meme';

    const img = document.createElement('img');
    img.src = meme.src;
    img.alt = meme.alt || meme.caption || 'Meme ' + (i + 1);
    img.loading = i < 2 ? 'eager' : 'lazy';
    img.decoding = 'async';
    figure.appendChild(img);

    if (meme.caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = meme.caption;
      figure.appendChild(caption);
    }

    container.appendChild(figure);
  });

  // Fade each meme in as it scrolls into view.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const figures = container.querySelectorAll('.meme');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    figures.forEach(function (f) { f.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  figures.forEach(function (f) { observer.observe(f); });
})();
