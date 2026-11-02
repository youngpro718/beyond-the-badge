BEYOND THE BADGE — EVENT SIGN-UP PAGE

FILES
  index.html     The page people land on after scanning the QR code.
  settings.html  Where you set up the look: theme, title, background, colors,
                 guide (mascot), chase animation and event date. It shows a
                 live phone preview and makes the link and a themed QR card
                 to download or print.
  themes.js      The holiday themes and the mascots, shared by both pages.
                 Edit a theme's colors, title, decorations or runaway here.
                 After editing it, raise the number in "themes.js?v=4" in
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
  Everything chosen in settings.html is written into the page link
  (index.html?t=halloween&h=...). The QR code is just that link, so whoever
  scans it gets that exact look. Nothing about the look is stored in the
  database. Change the settings, and print a new QR code.
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

SUBMISSIONS
  Responses still go to the same Supabase table (thanksgiving_responses)
  with the same columns, so the four questions are unchanged. The countdown
  uses the date from settings, or the event date saved in Supabase if the
  link has none. The settings preview never sends responses.

STILL OPEN
  Hosting: the page needs a public address before phones can open the QR
  code. Until then the QR code points at this computer. Put the hosted
  address in "Page address" in settings.html, then download the QR card.
  A private view/export of responses and a check of the database
  permissions are still to do.

Open the pages through a web server, not by double-clicking the file
(for a quick local test: python3 -m http.server 8080 in this folder, then
http://localhost:8080/settings.html). No database service-role or secret
keys are included. Preserve response privacy and existing data.
