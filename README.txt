BEYOND THE BADGE — EVENT SIGN-UP PAGE

FILES
  index.html     The page people land on after scanning the QR code.
  settings.html  Organizers only (email + password). Two tabs:
                 Page: everything about the sign-up page, in collapsible sections:
                 theme; title and date; sign-in message and questions (edit,
                 add, remove, reorder, up to 8); button and thank-you message;
                 background and colors; guide and chase; link and QR card.
                 Live phone preview beside it.
                 Responses: read, search, delete and download responses as
                 CSV; switch responses open or closed, one per person or not,
                 and "Start a new round" for the next event.
                 Reach it from the small "Organizer settings" link at the
                 bottom of the sign-up page.
  config.js      Supabase address and publishable key, and the online page
                 address. Shared by both pages.
  supabase/setup.sql  One-time database setup (see ORGANIZER LOGIN). Done.
  supabase/hardening.sql  Extra tightening: size limits on the email and
                 answers columns, and removes table access nobody needs. Done.
  supabase/response-rules.sql  Lets organizers delete responses, and makes
                 the database enforce one response per person, the
                 open/closed switch and the 30-a-minute spam limit. Run each
                 numbered block on its own in the SQL Editor.
  assets/share.png  The picture shown when the link is shared by text or chat.
  themes.js      The holiday themes and the mascots, shared by both pages.
                 Edit a theme's colors, title, decorations or runaway here.
                 After editing it, raise the number in "themes.js?v=12" in
                 index.html and settings.html so phones don't keep the old copy.
  assets/
    source/      The supplied art, unchanged:
                   animation-sheets/  officers and judges (run, dive,
                                      startled, catching breath, idle) and
                                      the turkey (run, look back)
                   holiday-mascots/   the other runaways (New Year baby,
                                      cupid, leprechaun, bunny, hot dog,
                                      crab, apple, ghost, elf)
                                      and holiday-officers.png (the six
                                      dressed-up officers for the page header)
                   legacy/            the first pose sheets (still used for
                                      the officer guide's poses)
    cut/         Transparent WebP frames made from that art, one folder per
                 character (female-officer/, male-officer/, female-judge/,
                 male-judge/, turkey/, ghost/ ...) plus holiday/ for the
                 header officers. About 3 MB in all.
    qrcode-generator.js  QR code library used by settings.html (MIT license).
  tools/make-cutouts.py  Rebuilds assets/cut/ from assets/source/. Run it
                 after adding or replacing art: python3 tools/make-cutouts.py
                 It stops and lists any sheet whose frames don't come out
                 the expected count or size.

ANIMATION
  Between the questions are three short scenes, starring the guide and an
  officer partner: the dash (the guide chases, dives and misses), the
  double-back (the runaway looks back and doubles back past the partner,
  who startles, dives, misses and gives chase) and the team chase (both
  chase, get fooled and catch their breath). Every move
  uses the drawn frames: 8-frame run and dive, 6-frame runaway run, 4-frame
  look-back. They play when someone scrolls to them and replay when they
  scroll back. With "reduce motion" turned on, a still picture shows instead.
  Themes for New Year, Valentine's, St. Patrick's, Fourth of July,
  Thanksgiving and Winter show their dressed-up officer at the top.

HOW THE SETTINGS REACH THE PAGE
  Everything chosen in settings.html, questions included, is written into
  the page link (index.html?t=halloween&h=...&q=...). The QR code is just
  that link, so whoever scans it gets that exact page. Change the settings,
  and print a new QR code. The settings page also saves your choices in the
  database (page_settings), so every organizer sees the same settings on any
  device.
  With no settings in the link, the page uses the holiday theme for the
  current month and picks a guide for each visitor.

THEMES (automatic by month)
  January New Year · February Valentine's Day · March St. Patrick's Day ·
  April Spring · May Memorial Day · June Juneteenth · July Fourth of July ·
  August Summer · September Labor Day · October Halloween · November
  Thanksgiving · December Winter Holidays. "Plain navy" is for any other event.
  Memorial Day, Juneteenth and Plain navy have no chase on purpose; a row of
  the theme's decorations sits between questions instead.
  Courthouse Superlatives (any time) looks like the paper flyer: parchment,
  poster lettering, typewriter questions, star numbers and the flyer's art
  across the top. Its art is in assets/cut/themes/, cut from
  assets/source/themes/courthouse-superlatives-flyer.webp.

QUESTION SETS ("Start from" in settings)
  A moment of thanks (the original four) and Courthouse Superlatives (six
  nominations). Picking one fills in the theme, wording and questions; the
  link then just says p=superlatives, so the QR code stays simple. Anything
  changed afterwards is added to the link.

MASCOTS
  Guides: female officer, male officer, female judge, male judge. All four
  run, dive and catch their breath. The guide leads the chase; with no
  guide, an officer leads. The partner is always an officer.
  To add art: put the sheet in assets/source/, add a line for it in
  tools/make-cutouts.py, run the script, then add the character to
  MASCOTS or RUNAWAYS in themes.js.

SIGN-IN AND SUBMISSIONS
  Visitors sign in with their name (required) and email (optional) before
  the questions appear. Both are remembered on their phone and saved with
  every response ("Not you?" switches person and clears the answer boxes,
  for a shared phone or tablet). Visitors have no password; this only
  records who they are. Answers in progress are kept on the phone until
  they're sent, so a refresh doesn't lose them. A hidden box catches spam
  robots: anything that fills it in is thanked but not saved.
  Responses go to the Supabase table thanksgiving_responses. The first four
  answers go into the original columns (coworker_thanks, smiling_moment,
  team_thanks, looking_forward). If the questions were edited, each column
  also gets its question, and answers 5 to 8 are added to looking_forward.
  After supabase/setup.sql has run, the email has its own column and every
  question and answer is saved exactly as asked in the "answers" column.
  Before that, the email is saved next to the name, e.g.
  "Maria Lopez (maria@example.com)".
  The countdown uses the date from settings, or the event date saved in
  Supabase if the link has none. The settings preview never sends responses.

ONLINE (GitHub Pages)
  Page:      https://youngpro718.github.io/beyond-the-badge/index.html
  Settings:  https://youngpro718.github.io/beyond-the-badge/settings.html
  Code:      https://github.com/youngpro718/beyond-the-badge (public)
  QR codes always point at the online page, even when settings.html is
  opened from this computer. To publish a change: commit and push to main;
  the site updates in a minute or two. assets/source/ (the original art)
  is not uploaded; it stays on this computer.

QR CARD
  "QR code shape" in settings: Badge (a police shield with a star), Circle
  or Square. The code sits in the middle with a clear white border so it
  still scans; the loose dots around it are decoration.
  "Put the QR code on your own flyer" (same section): choose any flyer or
  photo, pick a corner and a size, and download it with a "Scan to
  nominate" tag. It's drawn on your computer (nothing is uploaded) and
  checked to make sure the code still scans.

HEADER PICTURE
  Any picture (theme art, a guide, an upload) can be shown Centered or
  Across the top, like a flyer banner. Automatic: poster themes' art goes
  across the top, everything else is centered.

ORGANIZER LOGIN (one-time setup in the Supabase dashboard)
  1. SQL Editor > New query: paste supabase/setup.sql, change
     you@example.com to your email (one line per organizer), Run.
  2. Authentication > Users > Add user > Create new user: your email and a
     password, "Auto Confirm User" ticked.
  3. Authentication > URL Configuration: add
     https://youngpro718.github.io/beyond-the-badge/settings.html
     to Redirect URLs, so "Forgot password?" emails come back to the page.
  4. Authentication > Sign In / Providers: turn off "Allow new users to sign
     up", so nobody else can make an account.
  To add an organizer later: add their email to the organizers table and
  create their user (step 2). Only listed emails can open the settings or
  read responses; the database enforces it, not just the page.

Open the pages through a web server, not by double-clicking the file
(for a quick local test: python3 -m http.server 8080 in this folder, then
http://localhost:8080/settings.html). No database service-role or secret
keys are included. Preserve response privacy and existing data.
