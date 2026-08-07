(() => {
  const unlockAt = Date.parse('2026-08-10T15:00:00Z');
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview') === 'itinerary';
  const unlocked = preview || Date.now() >= unlockAt;

  const lockedCard = document.getElementById('lockedCard');
  const scheduleCard = document.getElementById('scheduleCard');

  if (unlocked) {
    scheduleCard.hidden = false;
  } else {
    lockedCard.hidden = false;
  }
})();
