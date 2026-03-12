#!/usr/bin/env python3
"""
Сжимает изображения кассет в public/tapes/ без заметных потерь:
- уменьшает до max 1024px по длинной стороне (хватает для 2x retina);
- перезаписывает PNG с оптимизацией или сохраняет WebP (если нужен ещё меньший размер).

Запуск:
  pip install Pillow
  python scripts/compress_cassette_images.py

Оригиналы копируются в public/tapes/original_backup/ (создаётся при первом запуске).
"""

import os
import shutil
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Установите Pillow: pip install Pillow")
    raise SystemExit(1)

TAPES_DIR = Path(__file__).resolve().parent.parent / "public" / "tapes"
BACKUP_DIR = TAPES_DIR / "original_backup"
MAX_SIZE = 1024  # пикселей по длинной стороне
WEBP_QUALITY = 92  # 0–100, 92 — почти без потерь
SAVE_WEBP = False  # True — сохранять .webp (нужно будет поменять пути в cassetteImages.ts)


def compress_image(path: Path, backup: bool = True) -> None:
    if not path.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"):
        return
    img = Image.open(path).convert("RGBA" if path.suffix.lower() == ".png" else "RGB")
    w, h = img.size
    if max(w, h) <= MAX_SIZE and not SAVE_WEBP:
        # только оптимизация без ресайза
        img.save(path, "PNG", optimize=True)
        return
    if max(w, h) > MAX_SIZE:
        ratio = MAX_SIZE / max(w, h)
        new_size = (int(w * ratio), int(h * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    if backup and BACKUP_DIR.exists() is False:
        BACKUP_DIR.mkdir(parents=True)
    out_name = path.stem + (".webp" if SAVE_WEBP else path.suffix)
    out_path = path.parent / out_name
    if backup and not (BACKUP_DIR / path.name).exists():
        shutil.copy2(path, BACKUP_DIR / path.name)
    if SAVE_WEBP:
        img.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
        if out_path != path and path.exists():
            path.unlink()
    else:
        img.save(out_path, "PNG", optimize=True)


def main():
    if not TAPES_DIR.exists():
        print(f"Папка не найдена: {TAPES_DIR}")
        return
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    for f in sorted(TAPES_DIR.iterdir()):
        if f.is_file() and f.suffix.lower() in (".png", ".jpg", ".jpeg"):
            size_before = f.stat().st_size
            compress_image(f, backup=True)
            size_after = (f.parent / (f.stem + (".webp" if SAVE_WEBP else f.suffix))).stat().st_size
            print(f"{f.name}: {size_before / 1024 / 1024:.2f} MB -> {size_after / 1024 / 1024:.2f} MB")
    print("Готово. Оригиналы в", BACKUP_DIR)


if __name__ == "__main__":
    main()
