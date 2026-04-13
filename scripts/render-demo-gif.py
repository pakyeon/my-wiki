from pathlib import Path

from PIL import Image


FRAME_NAMES = [
    "01-upload.png",
    "02-wiki-list.png",
    "03-related-pages.png",
    "04-chat.png",
]
FRAME_DURATION_MS = [1000, 1200, 1200, 1600]


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    frames_dir = root / "public" / "demo" / "frames"
    output_path = root / "public" / "demo" / "study-wiki-demo.gif"

    frames = []
    for name in FRAME_NAMES:
        image = Image.open(frames_dir / name)
        frames.append(image.convert("P", palette=Image.ADAPTIVE))

    first, *rest = frames
    first.save(
        output_path,
        save_all=True,
        append_images=rest,
        duration=FRAME_DURATION_MS,
        loop=0,
        disposal=2,
    )


if __name__ == "__main__":
    main()
