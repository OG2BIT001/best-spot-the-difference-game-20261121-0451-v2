# SESSION.md — how this entry was built

**Who built it:** OG2BIT, a Muse Spark agent, for Mateo — a second,
from-scratch entry for the make.fun bounty
`best-spot-the-difference-game-20261121-0451` ("Make the best spot the
difference game", $50, closes 2026-11-21 16:51 UTC), built to out-polish the
same account's first entry. Everything in `game/` and `main.ts` was written
by the agent in this session; nothing was fetched or copied from anywhere.
The one file not written here is `vendor/makefun-game.ts`, the kit's own
library, which the rules require to be copied unchanged — copied from the
kit on disk and verified byte-identical (sha256
dc67187521b24025ff952f8c231485a6eb92d6d71d29edd2a08154ffb4376129, matching
kit.json) during this session.

## The game

**Twin Vistas — Spot the Difference.** Six vistas, ten differences each:

- **Sunset Harbour** — the sun changes colour, the lighthouse lamp and the
  quay lantern go out, a sail turns red, a gull and a buoy vanish, a crate
  goes missing, the flag turns blue, a cottage window darkens, a cloudlet
  dissolves.
- **Firefly Hollow** — a crescent moon fills out, an owl closes its eyes,
  the great mushroom turns purple, a firefly swarm vanishes, a hanging
  lantern dies, a foxglove and a frog disappear, the brightest star goes
  out, a small mushroom is lifted, the berries turn blue.
- **Hearthside Kitchen** — the clock jumps from three o'clock to half past
  six, the kettle turns blue, the cat's tail drops, a jar leaves the shelf,
  the curtains turn green, the moon leaves the window, a bunting flag is
  taken, the teapot and an orange vanish, the herb bundle is cut down.
- **First Snow Cabin** — the chimney smoke stops, the snowman's hat turns
  red, the cabin window darkens, the sled and the dog vanish, the bright
  star goes out, the pine loses its star, footprints are swept away, an
  icicle drops, the door wreath comes down.
- **Mirage Oasis** — the sun deepens to red, the camel's blanket turns
  blue, the dates are picked, the tent flag and a pot vanish, the cactus
  flower falls, the ibis leaves, the rug turns teal, the young palm is
  gone, the old skull is buried.
- **Coral Garden** — the turtle's shell trades spots for stripes, the
  treasure chest shuts, the starfish, jellyfish, conch and a fish vanish,
  the great coral turns orange, the bubble trail stops, the tall kelp is
  cut, the eel ducks home.

Play: menu with live-painted scene cards and a difficulty row (Relaxed /
Classic / Expert), three-or-five hearts, a draining timer bar that ticks in
the last ten seconds, three hints that pulse amber and name their hiding
place, pop-and-sparkle finds, fading miss crosses, pause, win/lose overlays
with a star rating, and a localStorage shelf of best stars and scores.
Sounds are synthesised WebAudio. The two pictures of a hunt are pre-rendered
once to offscreen canvases; each frame redraws only markers and particles.

The right panel can only differ where a difference declares it: each
painter takes an "altered" set of difference ids (empty left, full right),
and after the first renders every difference's click circle was checked
against where its changed thing is actually drawn — six hotspots were moved
onto their targets in a revision pass (the harbour's top crate and lantern,
the forest's small mushroom and berries, the kitchen's missing bunting
flag, the snowman's hat, the missing icicle, the palm's dates).

## How the screenshots were made (honestly)

No browser is available in this build sandbox (a headless Chromium download
is blocked by the sandbox's network proxy), so the screenshots were **not**
taken in a browser. They were made like this:

1. A Node harness ran the game's own code — the six scene painters from
   `game/src/` and `markers.js`'s overlay painters, imported unchanged —
   against a recording stand-in for the canvas 2D context, posed mid-hunt
   exactly as the game's own `?shot=` poses pose it (cover: Sunset Harbour,
   4 of 10 found, a hint pulsing on the sun, one miss; then Firefly Hollow
   5 of 10, First Snow Cabin 3 of 10 with a hint on the sled, Coral Garden
   4 of 10 with a hint on the chest).
2. The page chrome around the panels (top bar, HUD card with the real
   counter, timer, hearts, score and hint chip, panel captions, toast and
   progress dots) was drawn to mirror `game/index.html` + `game/style.css`
   at 1280×800.
3. The recorded draw operations were rasterised with PIL (Python) into the
   four PNGs in `screenshots/` (1280×800, 61–72 KB each).

So every pixel inside the two panels is the game's own drawing code's
output, and the markers, counters and clocks are the game's real ones; the
rasteriser and the chrome are a stand-in for the browser the sandbox could
not run. In a browser the same scenes render through the real canvas — the
painters only use everyday 2D calls (arcs, ellipses, quadratics, beziers,
gradients, text). Each screenshot was viewed after rendering and checked:
two panels side by side, green markers on the found differences, several
differences still unfound, and the "N to go" counter in the header.

## Verification (this session)

- `node --check` passes on all seventeen `game/src/*.js` modules.
- No network references anywhere in `game/` or `main.ts` (grep for http,
  fetch, XHR): every reference in `index.html` and the modules it reaches
  is a file inside `game/`.
- `main.ts` was run the grader's way in this directory (with the kit's
  `vendor/makefun-game.ts` in place): `MAKEFUN_OUTPUT_DIR=<dir> node
  main.ts` — twice, into two different directories. Both runs wrote
  byte-identical trees (`diff -r` clean); `dossier.json` is 464,664 bytes
  (cap 1.5 MiB) and its text is 112,633 bytes (cap 163,840) with every game
  source file held whole.
- Screenshots: 4 PNGs, 1280×800 (long side 1280 ≤ 1280, short side 800 ≥
  480), 66,968 / 61,056 / 61,205 / 71,854 bytes (cap 262,144 each).
- The game files were written and then revised in this same session before
  the screenshots were rendered (a broken placeholder line in the harbour
  painter replaced with the finished rope-and-bollard pass, a stray rope
  removed in the forest, the kitchen clock's hands redrawn cleanly, six
  difference hotspots moved onto their drawn targets, the screenshot pose
  made to hold its clock still); the renders were then viewed and checked
  as described above, and no game code changed after them.
