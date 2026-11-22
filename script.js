// ============ Mobile-Only Device Enforcement ============
const mobileBlocker = document.getElementById("mobile-blocker");

function checkIsMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Regex check for tablets and desktops vs phones
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(userAgent);
  const isMobilePhone = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent);
  const isWideScreen = window.innerWidth > 500;
  const isFinePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches && window.innerWidth > 450;

  if (!isMobilePhone || isTablet || isWideScreen || isFinePointer) {
    if (mobileBlocker) mobileBlocker.style.display = "flex";
  } else {
    if (mobileBlocker) mobileBlocker.style.display = "none";
  }
}

window.addEventListener("resize", checkIsMobile);
checkIsMobile();

// ============ Screen Elements ============
const screenHome = document.getElementById("screen-home");
const screenLetter = document.getElementById("screen-letter");
const screenProceed = document.getElementById("screen-proceed");
const screenTeaser = document.getElementById("screen-teaser");
const screenExhibit = document.getElementById("screen-exhibit");
const screenThings = document.getElementById("screen-things");
const screenYourTurn = document.getElementById("screen-yourturn");

const envelope = document.getElementById("envelope-container");
const letterWindow = document.querySelector(".letter-window");
const openGardenBtn = document.getElementById("open-garden-btn");

function showScreen(el) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  el.classList.add("active");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ============ Screen 1 -> Screen 2 ============
envelope.addEventListener("click", () => {
  showScreen(screenLetter);
  setTimeout(() => {
    letterWindow.classList.add("open");
  }, 50);
});

// ============ Screen 3: Instagram Notification Stack Logic ============
const users = [
  ["Someone", "#ff9a3c,#e8336d"],
  ["Someone", "#7f5af0,#2cb1ff"],
  ["Someone", "#00c9a7,#2575fc"],
  ["Someone", "#f7b733,#fc4a1a"],
  ["Someone", "#ee0979,#ff6a00"]
];

const stack = document.getElementById('stack');
const fishyText = document.getElementById('fishy-text');
const replayBtn = document.getElementById('replay');
const igSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="#fff" stroke="none"/></svg>';

let timeouts = [];

function tick() {
  const d = new Date();
  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  if (timeEl) timeEl.textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
  if (dateEl) dateEl.textContent = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}
tick();
setInterval(tick, 15000);

function depth() {
  [...stack.children].forEach((w) => {
    w.style.setProperty('--s', '1');
    w.style.setProperty('--o', '1');
  });
}

function addNotification(i) {
  const [name, grad] = users[i];
  const w = document.createElement('div');
  w.className = 'wrap';
  w.innerHTML = `<div class="inner"><div class="card-notif">
    <div class="app">${igSvg}</div>
    <div class="body">
      <div class="row"><span class="title">Instagram</span><span class="when">just now</span></div>
      <div class="msg"><b>${name}</b> liked your post.</div>
    </div>
    <div class="thumb" style="background:linear-gradient(135deg,${grad})"></div>
  </div></div>`;
  stack.prepend(w);
  depth();
  requestAnimationFrame(() => requestAnimationFrame(() => w.classList.add('in')));
  try { navigator.vibrate && navigator.vibrate(40); } catch (e) {}
}

function runNotifications() {
  timeouts.forEach(t => clearTimeout(t));
  timeouts = [];
  stack.innerHTML = '';
  fishyText.classList.remove('show');
  replayBtn.classList.remove('show');

  users.forEach((_, i) => {
    const t = setTimeout(() => addNotification(i), 500 + i * 1400);
    timeouts.push(t);
  });

  const finishTime = 500 + users.length * 1400;

  const fishyTimer = setTimeout(() => {
    fishyText.classList.add('show');
  }, finishTime + 200);
  timeouts.push(fishyTimer);

  const showBtnTimer = setTimeout(() => {
    replayBtn.classList.add('show');
  }, finishTime + 1100);
  timeouts.push(showBtnTimer);
}

// Screen 2 -> Screen 3
openGardenBtn.addEventListener("click", () => {
  screenProceed.classList.remove("faded", "content-visible");
  showScreen(screenProceed);

  requestAnimationFrame(() => {
    setTimeout(() => {
      screenProceed.classList.add("faded");
    }, 50);
  });

  setTimeout(() => {
    screenProceed.classList.add("content-visible");
    runNotifications();
  }, 1200);
});

// ============ Teaser Flow Helper ============
const teaserTextEl = document.getElementById("teaser-text");

async function playTextSequence(lines) {
  showScreen(screenTeaser);
  teaserTextEl.classList.remove("show");
  teaserTextEl.textContent = "";

  for (const line of lines) {
    teaserTextEl.textContent = line.text;
    await sleep(60);
    teaserTextEl.classList.add("show");
    await sleep(line.stay || 1600);
    teaserTextEl.classList.remove("show");
    await sleep(550); // wait for fade out
  }
}

// ============ "let's investigate" -> Sequence 1 -> Exhibit A ============
replayBtn.onclick = async () => {
  // Sequence 1:
  // "HUH" -> fade out
  // "Seems someone's interested!!" -> fade out
  // "Let's start a convo" -> fade out
  // Reveal Exhibit A
  await playTextSequence([
    { text: "HUH", stay: 1400 },
    { text: "Seems someone's interested!!", stay: 1800 },
    { text: "Let's start a convo", stay: 1800 }
  ]);

  showScreen(screenExhibit);
  playExhibit();
};

// ============ Exhibit A Logic ============
const M = [
  { s: 'them', t: 'hi.', m: 0, w: 900 },
  { s: 'me', t: 'hey', m: 0, w: 1100 },
  { s: 'them', t: 'so… how are you', m: 0, w: 1500 },
  { s: 'me', t: 'good. you?', m: 0, w: 1400, n: 'Subject says “good.” Suspiciously brief.' },
  { s: 'them', t: 'good', m: 0, w: 1300 },
  { s: 'me', t: 'cool', m: 1, w: 1500 },
  { s: 'them', t: 'yeah. cool.', m: 1, w: 1300, n: 'Word count: dangerously low.' },
  { s: 'me', t: 'okay, honest moment: I have no idea what to say next', m: 2, w: 1700, n: 'Breakthrough. Suspect confesses.' },
  { s: 'them', t: 'lol thank god, me neither', m: 3, w: 900 },
  { s: 'me', t: 'we’re both being so weird rn 😭', m: 3, w: 800 },
  { s: 'them', t: 'SO weird. who even are we', m: 4, w: 700 },
  { s: 'me', t: 'two people who are very bad at starting conversations 😌', m: 4, w: 800, n: 'Cringe levels: dropping. Case looking good.' }
];

const lvl = [100, 78, 52, 30, 14];
const chat = document.getElementById('chat');
const meter = document.getElementById('meter');
const exhibitReopenBtn = document.getElementById('exhibit-reopen');
const st = document.getElementById('st');
const up = document.getElementById('up');
const up2 = document.getElementById('up2');

let exhibitRun = 0;
const down = () => chat.scrollTop = chat.scrollHeight;

function setMeter(v) {
  meter.style.width = v + '%';
  meter.style.background = v > 60 ? 'var(--red)' : v > 30 ? '#d98a1f' : '#2f7d4f';
}

function stamp(el, txt) {
  el.textContent = txt;
  el.classList.remove('slam');
  void el.offsetWidth;
  el.classList.add('slam');
}

async function playExhibit() {
  const id = ++exhibitRun;
  chat.innerHTML = '';
  exhibitReopenBtn.classList.remove('show');
  up.classList.remove('on');
  stamp(st, 'Awkward');
  setMeter(100);
  await sleep(700);

  for (const x of M) {
    if (id !== exhibitRun) return;
    const ty = document.createElement('div');
    ty.className = 'chat-row ' + x.s;
    ty.innerHTML = '<div class="typing"><i></i><i></i><i></i></div>';
    chat.appendChild(ty);
    down();
    await sleep(x.w);
    if (id !== exhibitRun) return;
    ty.remove();

    const r = document.createElement('div');
    r.className = 'chat-row ' + x.s;
    const b = document.createElement('div');
    b.className = 'b';
    b.dataset.m = x.m;
    b.textContent = x.t;
    r.appendChild(b);

    if (x.n) {
      const n = document.createElement('div');
      n.className = 'note';
      n.textContent = x.n;
      r.appendChild(n);
    }
    chat.appendChild(r);
    down();
    setMeter(lvl[x.m]);
    if (x.m === 2 && st.textContent === 'Awkward') stamp(st, 'Awkward (improving?)');
    await sleep(450);
  }

  await sleep(500);
  up.classList.add('on');
  stamp(up2, 'Slightly less awkward');
  exhibitReopenBtn.classList.add('show');
}

// ============ "reopen case file" -> Sequence 2 -> Things about me ============
exhibitReopenBtn.onclick = async () => {
  // Sequence 2:
  // "It was awkward" -> fade out
  // "let me tell you about me" -> fade out
  // Reveal "Things about me you don't know yet"
  await playTextSequence([
    { text: "It was awkward", stay: 1600 },
    { text: "let me tell you about me", stay: 1800 }
  ]);

  showScreen(screenThings);
};

// ============ Things about me Logic ============
const cards = [...document.querySelectorAll('.card')];
const toast = document.getElementById('toast');
const btnStart = document.getElementById('btn-start');
let flipped = 0;

const say = (h) => {
  toast.style.opacity = 0;
  setTimeout(() => {
    toast.innerHTML = h;
    toast.style.opacity = 1;
  }, 150);
};

function sparkle(el) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const cols = ['#7c3aed', '#ec4899', '#f59e0b', '#22c55e'];
  for (let i = 0; i < 14; i++) {
    const d = document.createElement('i');
    d.className = 'pop';
    const a = Math.random() * 6.28;
    const l = 60 + Math.random() * 70;
    d.style.cssText = `left:${cx}px;top:${cy}px;background:${cols[i % 4]};--x:${Math.cos(a) * l}px;--y:${Math.sin(a) * l}px`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 850);
  }
}

cards.forEach((c) => {
  c.addEventListener('click', () => {
    const i = +c.dataset.i;
    try { navigator.vibrate && navigator.vibrate(i === 2 ? [30, 40, 30] : 25); } catch (e) {}

    if (i === 2) {
      c.classList.remove('tease', 'shake');
      void c.offsetWidth;
      c.classList.add('shake');
      setTimeout(() => c.classList.remove('shake'), 520);
      say('Nice try 😏 <b>This one unlocks after the next conversation.</b>');
      // Reveal "let's start" button smoothly
      setTimeout(() => {
        btnStart.classList.add('show');
      }, 350);
      return;
    }

    if (c.classList.contains('flipped')) return;
    c.classList.add('flipped');
    sparkle(c);
    flipped++;
    if (flipped === 1) say('One down. Small, but true.');
    if (flipped === 2) {
      say('Two down. <b>One left… 👀</b>');
      cards[2].classList.add('tease');
    }
  });
});

// "let's start" button navigates to "Your turn"
btnStart.addEventListener('click', () => {
  showScreen(screenYourTurn);
});

// ============ Your turn Logic ============
const ans = document.getElementById('ans');
const note = document.getElementById('note');
const chipsContainer = document.getElementById('chips');
const goBtn = document.getElementById('go');

if (chipsContainer) {
  chipsContainer.addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    ans.value = c.dataset.t;
    ans.focus();
    ans.setSelectionRange(ans.value.length, ans.value.length);
  });
}

if (goBtn) {
  goBtn.addEventListener('click', async () => {
    const body = ans.value.trim();
    const msg = body ? 'Okay, my turn. ' + body : 'Okay, my turn. One thing you should know about me: ';
    let ok = false;
    try {
      await navigator.clipboard.writeText(msg);
      ok = true;
    } catch (e) {
      try {
        ans.value = msg;
        ans.select();
        ok = document.execCommand('copy');
      } catch (_) {}
    }
    note.innerHTML = ok ? '<b>Copied!</b> Paste it in the DM 💬' : 'Couldn’t copy. Long-press your text to copy it, then paste in the DM.';
  });
}

// Start on home screen
showScreen(screenHome);
