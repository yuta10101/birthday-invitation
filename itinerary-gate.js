(() => {
  const notice = document.querySelector('.itinerary-notice');
  if (!notice) return;

  // 2026-08-11 00:00 JST = 2026-08-10 15:00 UTC.
  const unlockAt = Date.parse('2026-08-10T15:00:00Z');
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview') === 'itinerary';
  const unlocked = preview || Date.now() >= unlockAt;

  if (!unlocked) return;

  notice.classList.add('itinerary-unlocked');
  notice.setAttribute('role', 'link');
  notice.setAttribute('tabindex', '0');
  notice.setAttribute('aria-label', '当日のご案内を開く');

  const copy = notice.querySelector('.itinerary-notice-copy');
  const date = notice.querySelector('.itinerary-notice-date');
  if (copy) copy.innerHTML = '当日のご案内が届きました。<br>こちらからご覧ください。';
  if (date) date.textContent = 'Your itinerary is now available.';

  const open = () => {
    const suffix = preview ? '?preview=itinerary' : '';
    window.location.href = `itinerary.html${suffix}`;
  };

  notice.addEventListener('click', open);
  notice.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
})();
