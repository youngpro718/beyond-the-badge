"""Turn the supplied artwork into transparent animation frames.

Run from the project folder:  python3 tools/make-cutouts.py
Reads assets/source/, writes assets/cut/. The originals are never changed.

What it does to each sheet:
  1. Removes the white background (only the white that touches the edge,
     so white inside a character, like eyes or a ghost's body, stays).
  2. Finds the frames left to right and checks there are as many as expected.
  3. Scales every sheet of a character so that character is the same size
     in every action, and saves each frame as its own PNG.

To add art: drop the sheet in assets/source/, add a line to SHEETS below
(how many frames, and how tall the character is in this action compared
with standing), and run the script again.
"""
import os
import shutil
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "source")
OUT = os.path.join(ROOT, "assets", "cut")

PERSON = 270  # standing height in pixels for officers and judges (shown at about 100px, sharp on phone screens)
# Standing height of each runaway, relative to a person at PERSON.
RUNAWAY = {"turkey": 135, "cupid": 118, "bunny": 165, "ghost": 150, "elf": 195, "leprechaun": 188, "newyear-baby": 150,
           "hotdog": 150, "crab": 105, "apple": 140}

# out folder, action -> (source file, frame count, how tall this action is vs standing,
#                        which frame to measure: 'first' or 'max')
SHEETS = {}
for who in ("female-officer", "male-officer"):
    SHEETS[who] = {
        "run":     (f"animation-sheets/{who}-running.png", 8, 0.97, "max"),
        "dive":    (f"animation-sheets/{who}-diving.png", 8, 1.0, "first"),
        "startled": (f"animation-sheets/{who}-startled.png", 3, 1.0, "first"),
        "breath":  (f"animation-sheets/{who}-catching-breath.png", 2, 0.86, "max"),
        "idle":    (f"animation-sheets/{who}-idle.png", 4, 1.0, "first"),
    }
for who in ("female-judge", "male-judge"):
    SHEETS[who] = {
        "run":     (f"animation-sheets/{who}-running.png", 8, 0.97, "max"),
        "dive":    (f"animation-sheets/{who}-diving.png", 8, 1.0, "first"),
        "startled": (f"animation-sheets/{who}-startled.png", 3, 1.0, "first"),
        "breath":  (f"animation-sheets/{who}-catching-breath.png", 2, 0.86, "max"),
        "idle":    (f"animation-sheets/{who}-idle.png", 4, 1.0, "first"),
    }
RUNAWAY_SHEETS = {
    "turkey":       ("animation-sheets/turkey-running.png", "animation-sheets/turkey-look-back.png", 0.92),
    "cupid":        ("holiday-mascots/baby-cupid-flying.png", "holiday-mascots/baby-cupid-look-back.png", 1.0),
    "bunny":        ("holiday-mascots/bunny-running.png", "holiday-mascots/bunny-look-back.png", 0.92),
    "ghost":        ("holiday-mascots/ghost-floating.png", "holiday-mascots/ghost-look-back.png", 0.95),
    "elf":          ("holiday-mascots/elf-running.png", "holiday-mascots/elf-look-back.png", 0.95),
    "leprechaun":   ("holiday-mascots/leprechaun-running.png", "holiday-mascots/leprechaun-look-back.png", 0.95),
    "newyear-baby": ("holiday-mascots/new-year-baby-running.png", "holiday-mascots/new-year-baby-look-back.png", 0.95),
    "hotdog":       ("holiday-mascots/hotdog-running.png", "holiday-mascots/hotdog-look-back.png", 0.95),
    "crab":         ("holiday-mascots/crab-running.png", "holiday-mascots/crab-look-back.png", 0.9),
    "apple":        ("holiday-mascots/apple-running.png", "holiday-mascots/apple-look-back.png", 0.95),
}
for who, (run, look, ratio) in RUNAWAY_SHEETS.items():
    SHEETS[who] = {"run": (run, 6, ratio, "max"), "look": (look, 4, 1.0, "max")}

# The guide's expressive poses come from the first two pose sheets (4 x 3 grids).
LEGACY_POSES = {"female-officer": "legacy/officer-female.jpg", "male-officer": "legacy/officer-male.jpg"}
# Holiday officers for the page header: 3 x 2 grid, a label under each.
HOLIDAY_OFFICERS = ("holiday-mascots/holiday-officers.png", ["newyear", "valentine", "stpatrick", "independence", "thanksgiving", "winter"])


def transparent(img):
    rgb = np.asarray(img.convert("RGB")).astype(np.int16)
    lo = rgb.min(axis=2)
    labels, _ = ndimage.label(lo > 226)
    edge = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    bg = np.isin(labels, list(edge))
    alpha = np.where(bg, 0, 255).astype(np.float32)
    ring = ndimage.binary_dilation(bg, iterations=2) & ~bg
    alpha[ring] = np.minimum(alpha[ring], np.clip((255 - lo[ring]) / 70.0, 0, 1) * 255)
    return Image.fromarray(np.dstack([rgb.astype(np.uint8), alpha.astype(np.uint8)]), "RGBA")


def gap(a, b):
    """Distance between two boxes (x0, y0, x1, y1); 0 if they touch."""
    dx = max(a[0] - b[2], b[0] - a[2], 0)
    dy = max(a[1] - b[3], b[1] - a[3], 0)
    return (dx * dx + dy * dy) ** .5


def split_frames(img, expected, reach=28):
    """Cut a sheet into its drawings, left to right.

    The `expected` biggest pieces are the characters. Every smaller piece
    (a hand drawn apart, a feather, a fist) joins the character it is
    closest to, if it is within `reach` pixels; anything farther away is a
    stray bit of a neighboring drawing and is dropped.
    """
    arr = np.asarray(img)
    solid = arr[:, :, 3] > 40
    labels, n = ndimage.label(ndimage.binary_dilation(solid, iterations=2))
    pieces = []
    for k, sl in enumerate(ndimage.find_objects(labels), 1):
        box = (sl[1].start, sl[0].start, sl[1].stop, sl[0].stop)
        area = int((labels[sl] == k).sum())
        if area > 60:
            pieces.append({"k": k, "box": box, "area": area})
    pieces.sort(key=lambda p: -p["area"])
    # a seed must be a real drawing, not a loose hand: at least a fifth of the biggest
    seeds = [p for p in pieces[:expected] if p["area"] > pieces[0]["area"] * .2]
    for s in seeds:
        s["members"] = [s["k"]]
        s["full"] = list(s["box"])
        # distance from every pixel to this drawing, to see what is really touching it
        s["dist"] = ndimage.distance_transform_edt(labels != s["k"])
    for p in pieces[len(seeds):]:
        if p in seeds:
            continue
        where = labels == p["k"]
        dists = [(s["dist"][where].min(), s) for s in seeds]
        d, near = min(dists, key=lambda t: t[0])
        if d <= reach:
            near["members"].append(p["k"])
            f = near["full"]
            near["full"] = [min(f[0], p["box"][0]), min(f[1], p["box"][1]), max(f[2], p["box"][2]), max(f[3], p["box"][3])]
    frames = []
    for s in sorted(seeds, key=lambda s: s["full"][0]):
        mask = np.isin(labels, s["members"])
        out = arr.copy()
        out[:, :, 3] = np.where(mask, out[:, :, 3], 0)
        frames.append(Image.fromarray(out, "RGBA").crop(tuple(s["full"])))
    frames = [f.crop(f.getbbox()) for f in frames]
    # two drawings that touch come out as one wide frame: split it where they meet
    while len(frames) < expected:
        i = max(range(len(frames)), key=lambda j: frames[j].width)
        f = frames[i]
        cols = (np.asarray(f)[:, :, 3] > 40).sum(axis=0)
        lo, hi = int(f.width * .3), int(f.width * .7)
        cut = lo + int(np.argmin(cols[lo:hi]))
        halves = [f.crop((0, 0, cut, f.height)), f.crop((cut, 0, f.width, f.height))]
        frames[i:i + 1] = [h.crop(h.getbbox()) for h in halves]
    return frames


def save(img, name):
    # WebP keeps transparency at a fraction of PNG's size, which matters on phones
    path = os.path.join(OUT, name + ".webp")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "WEBP", quality=88, method=6)


def main():
    shutil.rmtree(OUT, ignore_errors=True)
    problems = []

    for who, actions in SHEETS.items():
        target = RUNAWAY.get(who, PERSON)
        for action, (file, count, ratio, measure) in actions.items():
            sheet = transparent(Image.open(os.path.join(SRC, file)))
            frames = split_frames(sheet, count)
            # sanity check: frames of one sheet should be roughly the same size
            heights = sorted(f.height for f in frames)
            if len(frames) != count or heights[0] < heights[-1] * (0.25 if action == "dive" else 0.6):
                problems.append(f"{file}: frame sizes look wrong {[f.size for f in frames]}")
            ref = frames[0].height if measure == "first" else max(f.height for f in frames)
            scale = target * ratio / ref
            for i, f in enumerate(frames, 1):
                save(f.resize((max(1, round(f.width * scale)), max(1, round(f.height * scale))), Image.LANCZOS), f"{who}/{action}{i}")

    for who, file in LEGACY_POSES.items():
        sheet = transparent(Image.open(os.path.join(SRC, file)))
        cw, ch = sheet.width / 4, sheet.height / 3
        # reach=4: in these old sheets everything belongs to the body, so nearby bits are neighbors' boots
        poses = [split_frames(sheet.crop((round(c * cw), round(r * ch), round((c + 1) * cw), round((r + 1) * ch))), 1, reach=4)[0]
                 for r in range(3) for c in range(4)]
        scale = PERSON / sorted(p.height for p in poses)[len(poses) // 2]
        for i, p in enumerate(poses):
            save(p.resize((round(p.width * scale), round(p.height * scale)), Image.LANCZOS), f"{who}/pose{i}")

    file, names = HOLIDAY_OFFICERS
    sheet = transparent(Image.open(os.path.join(SRC, file)))
    cw, ch = sheet.width / 3, sheet.height / 2
    for i, name in enumerate(names):
        r, c = divmod(i, 3)
        cell = sheet.crop((round(c * cw), round(r * ch), round((c + 1) * cw), round((r + 1) * ch)))
        arr = np.array(cell)
        # drop the printed label: small pieces in the bottom part of the cell
        solid = arr[:, :, 3] > 40
        labels, n = ndimage.label(solid)
        areas = ndimage.sum(solid, labels, range(1, n + 1))
        for k, sl in enumerate(ndimage.find_objects(labels), 1):
            is_label = sl[0].start > ch * 0.84 and (sl[0].stop - sl[0].start) < ch * 0.09
            # a small bit at the cell's side is part of the neighbor's drawing; the officer may touch the side too, so keep big pieces
            spills_in = (sl[1].start == 0 or sl[1].stop >= cell.width) and areas[k - 1] < areas.max() * .2
            if is_label or spills_in:
                arr[:, :, 3][labels == k] = 0
        clean = Image.fromarray(arr, "RGBA")
        if clean.getbbox() is None:
            problems.append(f"{file}: nothing left of {name}")
            continue
        clean = clean.crop(clean.getbbox())
        scale = 320 / clean.height
        save(clean.resize((round(clean.width * scale), 320), Image.LANCZOS), f"holiday/{name}")

    total = sum(len(files) for _, _, files in os.walk(OUT))
    print(f"wrote {total} frames to assets/cut/")
    if problems:
        print("CHECK THESE:\n  " + "\n  ".join(problems))
        sys.exit(1)


if __name__ == "__main__":
    main()
