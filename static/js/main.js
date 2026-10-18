(function () {
  'use strict';

  var DAY = 864e5;
  var STORE_KEY = (window.SITE_DOMAIN || 'tsd') + ':filters';

  // Convert a wall-clock time ("YYYY-MM-DD HH:mm") in an IANA time zone to a Date.
  function zonedTime(raw, tz) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/.exec(raw);
    if (!m) return null;
    var wall = Date.UTC(+m[1], m[2] - 1, +m[3], +(m[4] || 23), m[4] ? +m[5] : 59);
    var t = wall - tzOffset(wall, tz);
    return new Date(wall - tzOffset(t, tz));
  }

  // Offset (ms) of tz from UTC at instant t.
  function tzOffset(t, tz) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).formatToParts(new Date(t));
      var p = {};
      parts.forEach(function (x) { p[x.type] = +x.value; });
      return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - Math.floor(t / 1000) * 1000;
    } catch (e) {
      return 8 * 36e5; // fall back to Taipei
    }
  }

  var fmtDate = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  var fmtShort = new Intl.DateTimeFormat('zh-TW', { month: 'numeric', day: 'numeric' });

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function gcalStamp(d) {
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var lists = {
    open: document.getElementById('list-open'),
    tba: document.getElementById('list-tba'),
    past: document.getElementById('list-past')
  };

  var items = cards.map(function (el) {
    var raw = el.getAttribute('data-deadline');
    var d = raw === 'TBA' ? null : zonedTime(raw, el.getAttribute('data-tz'));
    var item = {
      el: el,
      deadline: d,
      tags: (el.getAttribute('data-tags') || '').split(/\s+/),
      text: el.textContent.replace(/\s+/g, ' ').toLowerCase(),
      num: el.querySelector('.cd-num'),
      unit: el.querySelector('.cd-unit')
    };
    if (d) {
      el.querySelector('.dl-time').textContent = fmtDate.format(d);
      var gcal = el.querySelector('.gcal');
      if (gcal) {
        var stamp = gcalStamp(d);
        gcal.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
          '&text=' + encodeURIComponent(el.getAttribute('data-title') + ' 報名截止') +
          '&dates=' + stamp + '/' + stamp +
          '&details=' + encodeURIComponent(el.getAttribute('data-link')) +
          '&location=' + encodeURIComponent(el.getAttribute('data-place') || '');
        gcal.hidden = false;
      }
    }
    return item;
  });

  function status(item, now) {
    if (!item.deadline) return 'tba';
    return item.deadline - now > 0 ? 'open' : 'past';
  }

  // Place cards into their section, sorted.
  function arrange() {
    var now = Date.now();
    var groups = { open: [], tba: [], past: [] };
    items.forEach(function (it) {
      it.status = status(it, now);
      groups[it.status].push(it);
    });
    groups.open.sort(function (a, b) { return a.deadline - b.deadline; });
    groups.past.sort(function (a, b) { return b.deadline - a.deadline; });
    Object.keys(groups).forEach(function (k) {
      groups[k].forEach(function (it) {
        it.el.classList.remove('is-open', 'is-tba', 'is-past');
        it.el.classList.add('is-' + k);
        lists[k].appendChild(it.el);
      });
    });

    var next = groups.open[0];
    if (!document.getElementById('stat-open')) return groups;
    document.getElementById('stat-open').textContent = groups.open.length;
    if (next) {
      var days = Math.floor((next.deadline - now) / DAY);
      document.getElementById('stat-next').textContent = days < 1 ? '今天' : days + ' 天';
      document.getElementById('stat-next-label').textContent = '後截止：' + next.el.getAttribute('data-title');
    } else {
      document.getElementById('stat-next').textContent = '—';
    }
    return groups;
  }

  function tick() {
    var now = Date.now();
    var moved = false;
    items.forEach(function (it) {
      if (!it.deadline) return;
      var diff = it.deadline - now;
      if ((diff > 0) !== (it.status === 'open')) moved = true;
      var el = it.el;
      el.classList.toggle('urgent', diff > 0 && diff < 3 * DAY);
      el.classList.toggle('soon', diff >= 3 * DAY && diff < 14 * DAY);
      if (diff > 0) {
        var s = Math.floor(diff / 1000);
        var d = Math.floor(s / 86400);
        var hms = pad(Math.floor(s % 86400 / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
        it.num.textContent = d > 0 ? d : hms;
        it.unit.textContent = d > 0 ? '天 ' + hms : '';
      } else {
        var ago = Math.floor(-diff / DAY);
        it.num.textContent = '已截止';
        it.unit.textContent = ago < 1 ? '今天' : ago + ' 天前';
      }
    });
    if (moved) { arrange(); filter(); }
  }

  // Filtering ------------------------------------------------------------
  var q = document.getElementById('q');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var active = [];
  if (chips.length) {
    try { active = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { active = []; }
  }
  chips.forEach(function (c) {
    var tag = c.getAttribute('data-tag');
    c.setAttribute('aria-pressed', active.indexOf(tag) >= 0 ? 'true' : 'false');
    c.addEventListener('click', function () {
      var i = active.indexOf(tag);
      if (i >= 0) active.splice(i, 1); else active.push(tag);
      c.setAttribute('aria-pressed', i >= 0 ? 'false' : 'true');
      try { localStorage.setItem(STORE_KEY, JSON.stringify(active)); } catch (e) {}
      filter();
    });
  });
  if (q) q.addEventListener('input', filter);

  function filter() {
    var terms = (q ? q.value : '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    var counts = { open: 0, tba: 0, past: 0 };
    items.forEach(function (it) {
      var ok = active.every(function (t) { return it.tags.indexOf(t) >= 0; }) &&
        terms.every(function (t) { return it.text.indexOf(t) >= 0; });
      it.el.hidden = !ok;
      if (ok) counts[it.status]++;
    });
    document.getElementById('sec-tba').hidden = counts.tba === 0;
    document.getElementById('h-open').parentNode.hidden = counts.open === 0;
    document.getElementById('past-count').textContent = counts.past + ' 筆';
    var past = document.getElementById('sec-past');
    past.hidden = counts.past === 0;
    if (terms.length && counts.past) past.open = true;
    document.getElementById('empty').hidden = counts.open + counts.tba + counts.past > 0;
  }

  // Share / permalink -----------------------------------------------------
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.share');
    if (!a) return;
    e.preventDefault();
    var card = a.closest('.card');
    var url = location.href.split('#')[0] + '#' + card.id;
    history.replaceState(null, '', '#' + card.id);
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      navigator.share({ title: card.getAttribute('data-title'), url: url }).catch(function () {});
      return;
    }
    var done = function () {
      a.textContent = '已複製連結';
      setTimeout(function () { a.textContent = '分享'; }, 1600);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () {});
  });

  function revealHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var card = id && document.getElementById(id);
    if (!card || !card.classList.contains('card')) return;
    if (card.hidden) { if (q) q.value = ''; active = []; chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); }); filter(); }
    var past = document.getElementById('sec-past');
    if (past.contains(card)) past.open = true;
    card.classList.add('flash');
    card.scrollIntoView({ block: 'center' });
  }
  window.addEventListener('hashchange', revealHash);

  arrange();
  tick();
  filter();
  revealHash();
  setInterval(tick, 1000);
})();
