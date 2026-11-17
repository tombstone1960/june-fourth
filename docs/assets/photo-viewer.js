const viewer = document.querySelector("#photo-viewer");
const cards = [...document.querySelectorAll(".photo-card")];

if (typeof viewer.showModal === "function" && cards.length) {
  const launch = document.querySelector("#open-gallery");
  const screen = viewer.querySelector(".viewer-screen");
  const stage = viewer.querySelector(".viewer-image");
  const position = viewer.querySelector("#photo-position");
  const title = viewer.querySelector("#viewer-title");
  const credit = viewer.querySelector("#viewer-credit");
  const license = viewer.querySelector("#viewer-license");
  const record = viewer.querySelector("#viewer-record");
  const close = viewer.querySelector("#close-gallery");
  const fullscreen = viewer.querySelector("#toggle-fullscreen");
  let selected = 0;
  let opener;

  function show(index) {
    selected = (index + cards.length) % cards.length;
    const card = cards[selected];
    const image = new Image();
    image.alt = card.querySelector("img").alt;
    image.style.maxWidth = `${2 * Number(card.dataset.width)}px`;
    image.src = card.dataset.image;
    stage.replaceChildren(image);
    position.textContent = `${selected + 1} / ${cards.length}`;
    title.textContent = card.querySelector("h2").textContent;
    credit.textContent = card.querySelector("p").textContent;
    license.href = card.dataset.licenseUrl;
    license.textContent = card.dataset.license;
    record.href = card.href;
    record.setAttribute("aria-label", `Photo record for ${title.textContent}`);
  }

  function open(index, trigger) {
    opener = trigger;
    show(index);
    viewer.showModal();
  }

  launch.hidden = false;
  launch.addEventListener("click", () => open(0, launch));
  cards.forEach((card, index) => {
    card.setAttribute("aria-haspopup", "dialog");
    card.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(index, card);
    });
  });

  viewer.querySelector("#previous-photo").addEventListener("click", () => show(selected - 1));
  viewer.querySelector("#next-photo").addEventListener("click", () => show(selected + 1));
  close.addEventListener("click", () => viewer.close());

  viewer.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(selected + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });

  viewer.addEventListener("close", async () => {
    try {
      if (document.fullscreenElement === screen) await document.exitFullscreen();
    } finally {
      opener.focus();
    }
  });

  if (document.fullscreenEnabled && typeof screen.requestFullscreen === "function") {
    fullscreen.hidden = false;
    fullscreen.addEventListener("click", async () => {
      try {
        if (document.fullscreenElement === screen) {
          await document.exitFullscreen();
        } else {
          await screen.requestFullscreen();
        }
      } catch {
        fullscreen.hidden = true;
        close.focus();
      }
    });
    document.addEventListener("fullscreenchange", () => {
      fullscreen.textContent = document.fullscreenElement === screen ? "Exit full screen" : "Full screen";
    });
  }
}
