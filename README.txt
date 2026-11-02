BEYOND THE BADGE — EVENT SIGN-UP PAGE

FILES
  index.html     The page people land on after scanning the QR code.
  settings.html  Where you set everything up, in collapsible sections:
                 theme; title and date; sign-in message and questions (edit,
                 add, remove, reorder, up to 8); button and thank-you message;
                 background and colors; guide and chase; link and QR card.
                 Live phone preview beside it. Reach it from the small
                 "Organizer settings" link at the bottom of the sign-up page.
  themes.js      The holiday themes and the mascots, shared by both pages.
                 Edit a theme's colors, title, decorations or runaway here.
                 After editing it, raise the number in "themes.js?v=5" in
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
  that link, so whoever scans it gets that exact page. Nothing about the
  page is stored in the database. Change the settings, and print a new QR
  code. Settings are also saved in this browser, so they're there next time.
  With no settings in the link, the page uses the holiday theme for the
  current month and picks a guide for each visitor.

THEMES (automatic by month)
  January New Year · February Valentine's Day · March St. Patrick's Day ·
  April Spring · May Memorial Day · June Juneteenth · July Fourth of July ·
  August Summer · September Labor Day · October Halloween · November
  Thanksgiving · December Winter Holidays. "Plain navy" is for any other event.
  Memorial Day, Juneteenth and Plain navy have no chase on purpose; a row of
  the theme's decorations sits between questions instead.

MASCOTS
  Guides: female officer, male officer, female judge, male judge. All four
  run, dive and catch their breath. The guide leads the chase; with no
  guide, an officer leads. The partner is always an officer.
  To add art: put the sheet in assets/source/, add a line for it in
  tools/make-cutouts.py, run the script, then add the character to
  MASCOTS or RUNAWAYS in themes.js.

SIGN-IN AND SUBMISSIONS
  Visitors sign in with their name before the questions appear. The name is
  required, remembered on their phone, and saved with every response ("Not
  you?" switches person).
  Responses go to the Supabase table thanksgiving_responses. The first four
  answers go into the original columns (coworker_thanks, smiling_moment,
  team_thanks, looking_forward). If the questions were edited, each column
  also gets its question, and answers 5 to 8 are added to looking_forward.
  Run supabase/answers-column.sql once to also save every question and
  answer, exactly as asked, in an "answers" column.
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

STILL OPEN
  A private view/export of responses is still to do. The public key cannot
  read responses (checked: 401).

Open the pages through a web server, not by double-clicking the file
(for a quick local test: python3 -m http.server 8080 in this folder, then
http://localhost:8080/settings.html). No database service-role or secret
keys are included. Preserve response privacy and existing data.
