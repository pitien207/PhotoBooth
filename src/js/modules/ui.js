function createOptionCard({ title, description, label, isActive, accent, swatch }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `option-card${isActive ? " is-active" : ""}`;
  button.style.setProperty("--option-accent", accent);
  button.style.setProperty("--option-swatch", swatch);

  const heading = document.createElement("h3");
  heading.textContent = title;

  const copy = document.createElement("p");
  copy.textContent = description;

  const meta = document.createElement("span");
  meta.className = "option-meta";
  meta.textContent = label;

  button.append(heading, copy, meta);
  return button;
}

export function renderStyleCards(container, styles, selectedId, onSelect) {
  container.textContent = "";

  styles.forEach((style) => {
    const card = createOptionCard({
      title: style.name,
      description: style.tagline,
      label: style.label,
      isActive: style.id === selectedId,
      accent: style.accent,
      swatch: style.swatchBackground,
    });
    card.classList.add("compact-option-card", "style-option-card");

    card.addEventListener("click", () => {
      onSelect(style.id);
    });

    container.append(card);
  });
}

export function renderPhotoCountCards(container, photoCounts, selectedId, onSelect) {
  container.textContent = "";

  photoCounts.forEach((option) => {
    const card = createOptionCard({
      title: option.name,
      description: option.description,
      label: option.label,
      isActive: option.id === selectedId,
      accent: option.accent,
      swatch: option.swatchBackground,
    });
    card.classList.add("compact-option-card", "photo-count-option-card");

    card.addEventListener("click", () => {
      onSelect(option.id);
    });

    container.append(card);
  });
}

export function renderCountdownCards(container, countdowns, selectedId, onSelect) {
  container.textContent = "";

  countdowns.forEach((option) => {
    const card = createOptionCard({
      title: option.name,
      description: option.description,
      label: option.label,
      isActive: option.id === selectedId,
      accent: option.accent,
      swatch: option.swatchBackground,
    });
    card.classList.add("compact-option-card", "countdown-option-card");

    card.addEventListener("click", () => {
      onSelect(option.id);
    });

    container.append(card);
  });
}

export function renderStickerCards(container, stickers, selectedId, onSelect) {
  container.textContent = "";

  stickers.forEach((sticker) => {
    const card = createOptionCard({
      title: sticker.name,
      description: sticker.description,
      label: sticker.label,
      isActive: sticker.id === selectedId,
      accent: sticker.accent,
      swatch: sticker.swatchBackground,
    });
    card.classList.add("compact-option-card", "sticker-option-card");

    card.addEventListener("click", () => {
      onSelect(sticker.id);
    });

    container.append(card);
  });
}

export function renderShotTray(container, captures, totalShots = 4) {
  container.textContent = "";

  for (let index = 0; index < totalShots; index += 1) {
    const slot = document.createElement("div");
    slot.className = "shot-slot";

    const capture = captures[index];

    if (capture) {
      slot.classList.add("is-filled");
      const image = document.createElement("img");
      image.src = capture.toDataURL("image/jpeg", 0.82);
      image.alt = `Captured shot ${index + 1}`;
      slot.append(image);
    } else {
      slot.textContent = `Shot ${index + 1}`;
    }

    container.append(slot);
  }
}

export function setStatus(chip, message, tone = "warning") {
  chip.className = `status-chip is-${tone}`;
  chip.textContent = message;
}

export function setResultVisibility(canvas, placeholder, hasResult) {
  canvas.classList.toggle("is-visible", hasResult);
  placeholder.hidden = hasResult;
}
