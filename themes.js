// Shared by index.html (the sign-up page) and settings.html.
// Edit a theme, a guide or a runaway here and both pages pick it up.
// After editing, raise the number in "themes.js?v=12" in both pages, so phones
// that already opened the page download the new version instead of a cached one.
// Frames live in assets/cut/, made from assets/source/ by tools/make-cutouts.py.

// "frames('turkey', 'run', 6)" -> ['assets/cut/turkey/run1.webp', ... run6]
function frames(who, action, count) {
  return Array.from({ length: count }, (_, i) => `assets/cut/${who}/${action}${i + 1}.webp`);
}
const pose = (who, n) => `assets/cut/${who}/pose${n}.webp`;

// ---------------------------------------------------------------------------
// Runaways: what the officers chase between questions.
//   frames.run   loops while it runs (or flies)
//   frames.look  plays once when it stops to look back
//   fly          true = it travels above the ground
// ---------------------------------------------------------------------------
const RUNAWAYS = {
  newyearBaby: { name: 'New Year baby', frames: { run: frames('newyear-baby', 'run', 6), look: frames('newyear-baby', 'look', 4) } },
  cupid:       { name: 'cupid',         frames: { run: frames('cupid', 'run', 6), look: frames('cupid', 'look', 4) }, fly: true },
  leprechaun:  { name: 'leprechaun',    frames: { run: frames('leprechaun', 'run', 6), look: frames('leprechaun', 'look', 4) } },
  bunny:       { name: 'bunny',         frames: { run: frames('bunny', 'run', 6), look: frames('bunny', 'look', 4) } },
  ghost:       { name: 'ghost',         frames: { run: frames('ghost', 'run', 6), look: frames('ghost', 'look', 4) }, fly: true },
  turkey:      { name: 'turkey',        frames: { run: frames('turkey', 'run', 6), look: frames('turkey', 'look', 4) } },
  elf:         { name: 'elf',           frames: { run: frames('elf', 'run', 6), look: frames('elf', 'look', 4) } },
  hotdog:      { name: 'hot dog',       frames: { run: frames('hotdog', 'run', 6), look: frames('hotdog', 'look', 4) } },
  crab:        { name: 'crab',          frames: { run: frames('crab', 'run', 6), look: frames('crab', 'look', 4) } },
  apple:       { name: 'apple',         frames: { run: frames('apple', 'run', 6), look: frames('apple', 'look', 4) } },
};

// Holiday theme for each month, January first. Used when the theme is "auto".
const MONTH_THEMES = ['newyear', 'valentine', 'stpatrick', 'spring', 'memorial', 'juneteenth', 'independence', 'summer', 'laborday', 'halloween', 'thanksgiving', 'winter'];

// Each theme:
//   name      shown in settings
//   headline  the big title on the page (settings can replace it)
//   hero      holiday officer drawn at the top of the page, if there is one
//   decor     emoji that fall or sit in the background
//   runner    key in RUNAWAYS, or null for no chase
//             (Memorial Day and Juneteenth have none, on purpose)
//   colors    bg1/bg2 background gradient, card, ink (text), heading,
//             accent, soft (light tint), field (input border), button
//   style     'poster' = the vintage-flyer look (poster fonts, parchment,
//             star numbers, the picture across the top of the header)
const THEMES = {
  newyear:      { name: 'New Year', headline: 'Happy New Year', hero: 'assets/cut/holiday/newyear.webp', decor: ['🎉', '✨', '🎊'], runner: 'newyearBaby',
                  bg1: '#f6f1e3', bg2: '#e4d4a8', card: '#fffdf7', ink: '#1f2433', heading: '#1f2a4a', accent: '#a8842c', soft: '#f5edd6', field: '#d8cba6', button: '#1f2a4a' },
  valentine:    { name: "Valentine's Day", headline: "Happy Valentine's Day", hero: 'assets/cut/holiday/valentine.webp', decor: ['❤️', '💕', '🌹'], runner: 'cupid',
                  bg1: '#fdeef1', bg2: '#f4c3cf', card: '#fffafb', ink: '#3a1d26', heading: '#7a1f3b', accent: '#c8385a', soft: '#fbe3e9', field: '#e6c0ca', button: '#8a2441' },
  stpatrick:    { name: "St. Patrick's Day", headline: "Happy St. Patrick's Day", hero: 'assets/cut/holiday/stpatrick.webp', decor: ['☘️', '🍀', '🌈'], runner: 'leprechaun',
                  bg1: '#eaf5ea', bg2: '#bfe0c2', card: '#fbfdf9', ink: '#17301f', heading: '#1f5131', accent: '#2f8a4c', soft: '#e2f0e2', field: '#bcd3be', button: '#1f5131' },
  spring:       { name: 'Spring', headline: 'Hello, Spring', decor: ['🌸', '🌷', '🦋'], runner: 'bunny',
                  bg1: '#eef6ea', bg2: '#f6d9e5', card: '#fffdfe', ink: '#24302a', heading: '#33513a', accent: '#c06a90', soft: '#f6e8ee', field: '#d4dccd', button: '#33513a' },
  memorial:     { name: 'Memorial Day', headline: 'Honoring Memorial Day', decor: ['⭐'], runner: null,
                  bg1: '#eef2f8', bg2: '#d5dfee', card: '#fdfdfe', ink: '#17243a', heading: '#1d3354', accent: '#a23a3a', soft: '#eef1f6', field: '#c6cfdb', button: '#1d3354' },
  juneteenth:   { name: 'Juneteenth', headline: 'Celebrating Juneteenth', decor: ['✨', '⭐'], runner: null,
                  bg1: '#fbf1e0', bg2: '#ecd2a6', card: '#fffdf8', ink: '#22201b', heading: '#2b2a24', accent: '#b0322d', soft: '#f5ead5', field: '#d6c7ab', button: '#2f6b3a' },
  independence: { name: 'Fourth of July', headline: 'Happy Fourth of July', hero: 'assets/cut/holiday/independence.webp', decor: ['🎆', '⭐', '🇺🇸'], runner: 'hotdog',
                  bg1: '#eef3fb', bg2: '#d3dff2', card: '#fdfeff', ink: '#142540', heading: '#1a2f5a', accent: '#b8323a', soft: '#f4e6e7', field: '#c3cbdb', button: '#1a2f5a' },
  summer:       { name: 'Summer', headline: 'Hello, Summer', decor: ['☀️', '🌴', '🍉'], runner: 'crab',
                  bg1: '#e6f6f4', bg2: '#fde6bf', card: '#fcfefd', ink: '#133333', heading: '#12494a', accent: '#c47f22', soft: '#fbf0dc', field: '#bcd6d2', button: '#12494a' },
  laborday:     { name: 'Labor Day', headline: 'Happy Labor Day', decor: ['🍎', '🍂', '⭐'], runner: 'apple',
                  bg1: '#f6f0e4', bg2: '#e6d1a8', card: '#fffcf6', ink: '#2a2418', heading: '#3b3320', accent: '#b0702b', soft: '#f4e7d3', field: '#d8c9ab', button: '#3b3320' },
  halloween:    { name: 'Halloween', headline: 'Happy Halloween', decor: ['🎃', '🦇', '🍬'], runner: 'ghost',
                  bg1: '#fbe8d6', bg2: '#f0bf93', card: '#fffaf5', ink: '#241a14', heading: '#2b1d14', accent: '#c4581a', soft: '#f9e3cf', field: '#dfc4ab', button: '#3a2416' },
  thanksgiving: { name: 'Thanksgiving', headline: 'Happy Thanksgiving', hero: 'assets/cut/holiday/thanksgiving.webp', decor: ['🍂', '🍁', '🌾'], runner: 'turkey',
                  bg1: '#f8e6c9', bg2: '#e9b98a', card: '#fffaf2', ink: '#3a2a1c', heading: '#6b3415', accent: '#c4622d', soft: '#fbecd8', field: '#e2c9a8', button: '#7a3a17' },
  winter:       { name: 'Winter Holidays', headline: 'Happy Holidays', hero: 'assets/cut/holiday/winter.webp', decor: ['❄️', '⛄', '🎁'], runner: 'elf',
                  bg1: '#eaf2f9', bg2: '#c8dbec', card: '#ffffff', ink: '#17283a', heading: '#1d3c5a', accent: '#b8323a', soft: '#e8f0f7', field: '#c9d7e4', button: '#1d3c5a' },
  // Not tied to a holiday, for any other event.
  superlatives: { name: 'Courthouse Superlatives', headline: 'Courthouse Superlatives', hero: 'assets/cut/themes/superlatives.webp', decor: ['⭐', '🏆', '⚖️'], runner: null, style: 'poster',
                  bg1: '#f1e0bd', bg2: '#d9b27a', card: '#fbf0d9', ink: '#2a1d14', heading: '#8f1d1d', accent: '#c48a1c', soft: '#f5e3bd', field: '#c9a56d', button: '#1f2a4a' },
  navy:         { name: 'Plain navy', headline: 'Thank You', decor: [], runner: null,
                  bg1: '#eef2f6', bg2: '#d6e0ea', card: '#ffffff', ink: '#19304a', heading: '#253a51', accent: '#4a6a8a', soft: '#eaf0f5', field: '#c8d3de', button: '#254052' },
};

// ---------------------------------------------------------------------------
// Guides: the character who rides along at the bottom of the page.
//   guide    which drawing to show at each step of the page; tap = reactions;
//            blink = [eyes open, eyes closed] for the standing drawing
//   frames   drawings used in the chase scenes (run, dive, startled, breath, idle)
// ---------------------------------------------------------------------------
function officer(who, label, p) {
  return {
    label,
    guide: { hello: pose(who, p.hello), q: p.q.map(n => pose(who, n)), name: pose(who, p.name), ready: pose(who, p.ready),
             done: pose(who, p.done), call: pose(who, 3), tap: p.tap.map(n => pose(who, n)) },
    frames: { run: frames(who, 'run', 8), dive: frames(who, 'dive', 8), startled: frames(who, 'startled', 3),
              breath: frames(who, 'breath', 2), idle: frames(who, 'idle', 4) },
  };
}
function judge(who, label) {
  const idle = frames(who, 'idle', 4), startled = frames(who, 'startled', 3);
  return {
    label,
    guide: { hello: idle[2], q: [idle[3], idle[0], idle[3], idle[0]], name: idle[0], ready: idle[3], done: idle[2],
             call: idle[3], tap: [startled[1], startled[2]], blink: [idle[0], idle[1]] },
    frames: { run: frames(who, 'run', 8), dive: frames(who, 'dive', 8), startled, breath: frames(who, 'breath', 2), idle },
  };
}
const MASCOTS = {
  'female-officer': officer('female-officer', 'Female officer', { hello: 0, q: [2, 7, 4, 3], name: 8, ready: 1, done: 10, tap: [5, 7, 9] }),
  'male-officer':   officer('male-officer', 'Male officer', { hello: 1, q: [5, 7, 3, 6], name: 4, ready: 0, done: 10, tap: [8, 9, 7] }),
  'female-judge':   judge('female-judge', 'Female judge'),
  'male-judge':     judge('male-judge', 'Male judge'),
};
// When no guide is set, an officer leads the chase; the partner is always an officer.
const OFFICERS = ['female-officer', 'male-officer'];

// The questions on the page. The first four answers also go into the
// original database columns, in this order.
const QUESTIONS = [
  'A coworker I’m thankful for and why…',
  'A moment at work that made me smile…',
  'One thing my team does that deserves thanks…',
  'Something I’m looking forward to this season…',
];
const ANSWER_COLUMNS = ['coworker_thanks', 'smiling_moment', 'team_thanks', 'looking_forward'];
const MAX_QUESTIONS = 8;

const DEFAULTS = {
  theme: 'auto',       // 'auto' = holiday of the current month
  eyebrow: 'BEYOND THE BADGE',
  subtitle: 'A moment of thanks for the people and moments that make a difference.',
  heroImage: 'theme',  // picture above the title: theme | none | a key in MASCOTS | u:<uploaded file>
  heroLayout: 'auto',  // auto (poster art across the top, the rest centered) | center | wide
  signIn: 'Sign in with your name so we know who this is from.',
  intro: 'Share as much or as little as you like.',
  questions: QUESTIONS,
  button: 'Share my thanks',
  thanks: 'Thank you for sharing! Your response has been received.',
  mascot: 'auto',      // auto | a key in MASCOTS | choose | none
  background: 'fall',  // fall (moving) | still | plain
  chase: true,
  cta: 'Scan to share your thanks',
  qrShape: 'badge',    // square | badge | circle (QR card only, not part of the link)
  // Response rules: saved with the settings and checked by the database
  // (supabase/response-rules.sql), not part of the link
  open: true,          // accepting responses
  oneEach: true,       // one response per person (same name or email)
  roundStart: '',      // only responses since then count for "one each"
};

// Ready-made question sets, picked in settings ("Start from"). Each replaces
// the theme, the wording and the questions in one go.
const PRESETS = {
  thanks: {
    label: 'A moment of thanks', theme: 'auto', title: '', subtitle: DEFAULTS.subtitle, intro: DEFAULTS.intro,
    questions: QUESTIONS, button: DEFAULTS.button, thanks: DEFAULTS.thanks, cta: DEFAULTS.cta,
  },
  superlatives: {
    label: 'Courthouse Superlatives', theme: 'superlatives', title: '',
    subtitle: 'Every command has its legends.', intro: 'Nominate a coworker for each title.',
    questions: [
      'The Human GPS — always knows where to go',
      'The Calm in the Chaos — keeps everyone grounded',
      'The Walking Radio — knows what’s happening',
      'The Shift Saver — always comes through',
      'The Master of the Side-Eye — says it all without a word',
      'Your own award and nominee',
    ],
    button: 'Submit my nominations', thanks: 'Your nominations are in. Thank you!', cta: 'Scan to nominate a coworker',
  },
};

// Settings travel in the page link, so the QR code carries the look and the
// questions. Short keys keep the QR code small; questions repeat as q=...&q=...
const PARAM_KEYS = { theme: 't', title: 'h', eyebrow: 'e', subtitle: 's', heroImage: 'hi', heroLayout: 'hl', signIn: 'si', intro: 'i', button: 'bt', thanks: 'ty',
                     mascot: 'm', background: 'b', chase: 'c', date: 'd', bgColor: 'bg', accent: 'ac' };
const ON_OFF = ['chase'];
const OLD_MASCOT_NAMES = { female: 'female-officer', male: 'male-officer' };   // links printed before the judges existed

const sameQuestions = (a, b) => a.length === b.length && a.every((q, i) => q === b[i]);

// The wording a question set brings ("p=superlatives" in the link stands for
// all of it, which keeps the QR code simple). The theme is set separately.
function presetWords(key) {
  const p = PRESETS[key];
  if (!p) return {};
  const { label, theme, ...words } = p;
  return words;
}

function readSettings(search) {
  const p = new URLSearchParams(search);
  const s = Object.assign({}, DEFAULTS, presetWords(p.get('p')));
  for (const [key, short] of Object.entries(PARAM_KEYS)) if (p.has(short)) s[key] = p.get(short);
  for (const key of ON_OFF) s[key] = String(s[key]) !== '0' && String(s[key]) !== 'false';
  const qs = p.getAll('q').map(q => q.trim().slice(0, 300)).filter(Boolean).slice(0, MAX_QUESTIONS);
  if (qs.length) s.questions = qs;
  s.mascot = OLD_MASCOT_NAMES[s.mascot] || s.mascot;
  s.preview = p.get('preview') === '1';
  return s;
}

function settingsToQuery(s) {
  const p = new URLSearchParams();
  const qs = (s.questions || []).map(q => q.trim()).filter(Boolean);
  // a question set used as it is goes in as its name; only changes are spelled out
  const preset = Object.keys(PRESETS).find(k => k !== 'thanks' && sameQuestions(qs, PRESETS[k].questions));
  const base = Object.assign({}, DEFAULTS, presetWords(preset));
  if (preset) p.set('p', preset);
  for (const [key, short] of Object.entries(PARAM_KEYS)) {
    const v = s[key];
    if (ON_OFF.includes(key)) { if (v === false) p.set(short, '0'); continue; }
    if (v == null || v === '' || v === base[key]) continue;
    p.set(short, v);
  }
  if (qs.length && !sameQuestions(qs, base.questions)) qs.forEach(q => p.append('q', q));
  return p.toString();
}

// The picture above the title, or '' for none. Falls back to the theme's
// holiday officer (some themes have none) for "theme" or anything unknown.
function heroSrc(s, theme) {
  const v = s.heroImage || 'theme';
  if (v === 'none') return '';
  if (MASCOTS[v]) return MASCOTS[v].guide.hello;
  if (v.startsWith('u:') && /^[\w.-]+$/.test(v.slice(2)) && typeof IMAGE_FOLDER !== 'undefined') return IMAGE_FOLDER + v.slice(2);
  return theme.hero || '';
}

// Whether the picture runs edge to edge across the top, like a flyer banner.
function heroWide(s, theme, src) {
  if (!src || s.heroLayout === 'center') return false;
  return s.heroLayout === 'wide' || (theme.style === 'poster' && src === theme.hero);
}

function resolveTheme(choice, date) {
  const key = THEMES[choice] ? choice : MONTH_THEMES[(date || new Date()).getMonth()];
  const t = THEMES[key];
  return Object.assign({ key }, t, { runner: t.runner ? RUNAWAYS[t.runner] : null });
}
