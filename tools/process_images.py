"""Make web-ready copies of photos: resize, strip metadata (incl. GPS), save as JPEG.

Usage (from the repo root):
    python tools/process_images.py originals/epoxy-resin-molds assets/img/projects/epoxy-resin-molds
    python tools/process_images.py originals/gallery assets/img/gallery --max 1200

Needs Pillow:  pip install pillow
Outputs 01-name.jpg style files and prints width x height for the HTML.
Originals are never modified.
"""
import argparse
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "photo"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dest")
    ap.add_argument("--max", type=int, default=1600, help="max long edge in px (default 1600)")
    ap.add_argument("--quality", type=int, default=82)
    args = ap.parse_args()

    src, dest = Path(args.src), Path(args.dest)
    files = sorted(p for p in src.iterdir() if p.suffix.lower() in EXTS)
    if not files:
        sys.exit(f"No images found in {src}")
    dest.mkdir(parents=True, exist_ok=True)

    for i, p in enumerate(files, 1):
        with Image.open(p) as im:
            im = ImageOps.exif_transpose(im)  # apply rotation before metadata is dropped
            im.thumbnail((args.max, args.max))
            clean = Image.new("RGB", im.size)  # fresh image: carries no EXIF/GPS/ICC data
            clean.paste(im.convert("RGB"))
            out = dest / f"{i:02d}-{slug(p.stem)}.jpg"
            clean.save(out, "JPEG", quality=args.quality, optimize=True, progressive=True)
            print(f"{out}  width={clean.width} height={clean.height}")


if __name__ == "__main__":
    main()
