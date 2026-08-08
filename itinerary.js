(() => {
  // 2026-08-11 07:00 JST = 2026-08-10 22:00 UTC.
  const unlockAt = Date.parse('2026-08-10T22:00:00Z');
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview') === 'itinerary';
  const unlocked = preview || Date.now() >= unlockAt;

  const lockedCard = document.getElementById('lockedCard');
  const scheduleCard = document.getElementById('scheduleCard');

  if (unlocked) {
    document.body.classList.add('is-unlocked');
    scheduleCard.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scheduleCard.classList.add('is-ready'));
    });
  } else {
    lockedCard.hidden = false;
  }
})();
