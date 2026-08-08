(() => {
  const notice = document.querySelector('.itinerary-notice');
  if (!notice) return;

  // 2026-08-11 07:00 JST = 2026-08-10 22:00 UTC.
  const unlockAt = Date.parse('2026-08-10T22:00:00Z');
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview') === 'itinerary';
  const unlocked = preview || Date.now() >= unlockAt;

  notice.classList.add('itinerary-interactive');
  notice.setAttribute('role', 'button');
  notice.setAttribute('tabindex', '0');
  notice.setAttribute(
    'aria-label',
    unlocked ? '当日のご案内を開く' : '当日のご案内について確認する'
  );

  let modal = null;
  let previousFocus = null;

  const closeModal = () => {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('itinerary-modal-open');
    window.setTimeout(() => {
      if (modal && !modal.classList.contains('is-open')) modal.hidden = true;
    }, 260);
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus({ preventScroll: true });
    }
  };

  const ensureModal = () => {
    if (modal) return modal;

    modal = document.createElement('div');
    modal.className = 'itinerary-reserved-modal';
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="itinerary-reserved-backdrop" data-itinerary-close></div>
      <section class="itinerary-reserved-card" role="dialog" aria-modal="true" aria-labelledby="itineraryReservedTitle" aria-describedby="itineraryReservedDescription">
        <div class="itinerary-reserved-monogram" aria-hidden="true">YN</div>
        <p class="itinerary-reserved-kicker">YOUR ITINERARY</p>
        <div class="itinerary-reserved-rule" aria-hidden="true"><span></span></div>
        <p class="itinerary-reserved-status">RESERVED</p>
        <h2 id="itineraryReservedTitle" class="itinerary-reserved-title">まだ秘密です。</h2>
        <p id="itineraryReservedDescription" class="itinerary-reserved-copy">
          Your itinerary will be revealed at 7:00 AM<br class="itinerary-reserved-break">
          on your special day.
        </p>
        <p class="itinerary-reserved-subcopy">当日まで、もう少しだけお待ちください。</p>
        <button class="itinerary-reserved-close" type="button" data-itinerary-close>CLOSE</button>
      </section>
    `;

    document.body.appendChild(modal);

    modal.querySelectorAll('[data-itinerary-close]').forEach((element) => {
      element.addEventListener('click', closeModal);
    });

    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });

    return modal;
  };

  const openReservedModal = () => {
    const reservedModal = ensureModal();
    previousFocus = document.activeElement;
    reservedModal.hidden = false;
    reservedModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('itinerary-modal-open');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => reservedModal.classList.add('is-open'));
    });
    const closeButton = reservedModal.querySelector('.itinerary-reserved-close');
    window.setTimeout(() => closeButton?.focus({ preventScroll: true }), 180);
  };

  if (unlocked) {
    notice.classList.add('itinerary-unlocked');
    notice.setAttribute('role', 'link');
    notice.setAttribute('aria-label', '当日のご案内を開く');

    const copy = notice.querySelector('.itinerary-notice-copy');
    const date = notice.querySelector('.itinerary-notice-date');
    if (copy) copy.innerHTML = '当日のご案内が届きました。<br>こちらからご覧ください。';
    if (date) date.textContent = 'Your itinerary is now available.';
  } else {
    notice.classList.add('itinerary-locked');
  }

  const activate = () => {
    if (unlocked) {
      const suffix = preview ? '?preview=itinerary' : '';
      window.location.href = `itinerary.html${suffix}`;
      return;
    }
    openReservedModal();
  };

  notice.addEventListener('click', activate);
  notice.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  });
})();
