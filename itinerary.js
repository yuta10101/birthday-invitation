(() => {
  // 2026-08-11 07:00 JST = 2026-08-10 22:00 UTC.
  const unlockAt = Date.parse('2026-08-10T22:00:00Z');
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview') === 'itinerary';
  const unlocked = preview || Date.now() >= unlockAt;

  const lockedCard = document.getElementById('lockedCard');
  const booklet = document.getElementById('booklet');
  const pages = document.getElementById('bookletPages');
  const dayOne = document.getElementById('dayOne');
  const dayTwo = document.getElementById('dayTwo');

  if (!unlocked) {
    lockedCard.hidden = false;
    return;
  }

  document.body.classList.add('is-unlocked');
  booklet.hidden = false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentDay = 1;
  let turning = false;

  const setAccessibility = (day) => {
    const showDayTwo = day === 2;
    dayOne.setAttribute('aria-hidden', showDayTwo ? 'true' : 'false');
    dayTwo.setAttribute('aria-hidden', showDayTwo ? 'false' : 'true');
    dayOne.querySelectorAll('button, a').forEach((el) => { el.tabIndex = showDayTwo ? -1 : 0; });
    dayTwo.querySelectorAll('button, a').forEach((el) => { el.tabIndex = showDayTwo ? 0 : -1; });
  };

  const finishTurn = (targetDay) => {
    currentDay = targetDay;
    turning = false;
    pages.classList.remove('is-turning-forward', 'is-turning-back');
    pages.classList.toggle('is-day-two-settled', targetDay === 2);
    setAccessibility(currentDay);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const turnTo = (targetDay) => {
    if (turning || targetDay === currentDay) return;
    turning = true;

    if (reduceMotion) {
      pages.classList.toggle('show-day-two', targetDay === 2);
      finishTurn(targetDay);
      return;
    }

    if (targetDay === 2) {
      // Day 2 stays underneath Day 1. Only the Day 1 sheet moves, so there is
      // no layer swap before the turn begins.
      pages.classList.remove('is-day-two-settled');
      pages.classList.add('is-turning-forward');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => pages.classList.add('show-day-two'));
      });
    } else {
      // Make the rotated Day 1 sheet renderable again while its back face is
      // still hidden, then return it over Day 2 without swapping layers.
      pages.classList.remove('is-day-two-settled');
      pages.classList.add('is-turning-back');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => pages.classList.remove('show-day-two'));
      });
    }

    const turnDuration = targetDay === 2 ? 2950 : 1980;
    window.setTimeout(() => finishTurn(targetDay), turnDuration);
  };

  pages.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => turnTo(Number(button.dataset.page)));
  });

  setAccessibility(1);
})();
