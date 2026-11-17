# June Fourth Photo Archive · 六四影像档案

A photo archive and timeline of the 1989 Tiananmen protests, the military crackdown of June 3–4, and its aftermath in Beijing.

## Preview locally

From the repository root, run `python3 -m http.server 8000 --bind 127.0.0.1 --directory docs` and open [localhost:8000](http://127.0.0.1:8000). The site uses static HTML and CSS. GitHub Pages serves the `docs/` directory.

## Photograph records

Each [photo record](https://tombstone1960.github.io/june-fourth/photos/) gives the date, photographer, sources, reuse terms, and any resizing. CC BY-SA derivatives in this repository are distributed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

Edit `data/photographs.json` and run `python3 scripts/build_photos.py` to update the gallery and photo pages. Commit the generated HTML under `docs/photos/` along with the metadata.
