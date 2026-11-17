"""Regenerate the static photo gallery and records served by GitHub Pages."""

import json
from html import escape
from pathlib import Path
from string import Template

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = ROOT / "docs" / "photos"
TEMPLATES = ROOT / "scripts" / "templates"
LICENSE_URLS = {
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
    "CC0 1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "U.S. public domain": "https://www.copyright.gov/title17/92chap1.html#105",
}


def template(name):
    return Template((TEMPLATES / f"{name}.html").read_text(encoding="utf-8"))


def write_page(path, **context):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(template("photo-page").substitute(context), encoding="utf-8")


def render_record(photo):
    date_note = ""
    if photo.get("date_note"):
        date_note = f'\n            <p>{photo["date_note"]}</p>\n          '

    primary_link = ""
    if photo.get("primary_url"):
        primary_link = (
            f'\n            <a class="record-link" href="{photo["primary_url"]}">'
            f'{photo["primary_label"]} <span aria-hidden="true">↗</span></a>'
        )

    responsive = ""
    if photo.get("large_image"):
        responsive = (
            f'\n             srcset="../../{photo["image"]} {photo["width"]}w, '
            f'../../{photo["large_image"]} {photo["large_width"]}w"'
            '\n             sizes="(max-width: 780px) 94vw, (max-width: 1200px) 65vw, 780px"'
        )

    main = template("photo-record").substitute(
        {**photo, "date_note": date_note},
        primary_link=primary_link,
        responsive=responsive,
        license_url=LICENSE_URLS[photo["license"]],
    )
    write_page(
        PHOTOS / photo["slug"] / "index.html",
        title=photo["title"],
        description=photo["caption"],
        main=main.rstrip(),
        root="../../",
        gallery_current="",
    )


def main():
    records = json.loads((ROOT / "data" / "photographs.json").read_text(encoding="utf-8"))
    card_template = template("photo-card")
    cards = []

    for record in records:
        photo = {key: escape(str(value)) for key, value in record.items()}
        render_record(photo)
        cards.append(
            card_template.substitute(
                photo,
                viewer_image=photo.get("large_image", photo["image"]),
                viewer_width=photo.get("large_width", photo["width"]),
                license_url=LICENSE_URLS[photo["license"]],
            ).rstrip()
        )

    gallery = template("photo-gallery").substitute(cards="\n".join(cards))
    write_page(
        PHOTOS / "index.html",
        title="Photographs",
        description="Photographs of the 1989 Tiananmen protests, the aftermath in Beijing, and gatherings abroad.",
        main=gallery.rstrip(),
        root="../",
        gallery_current=' aria-current="page"',
    )


if __name__ == "__main__":
    main()
