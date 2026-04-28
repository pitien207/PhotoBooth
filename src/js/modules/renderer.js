import { createStyledCanvas } from "./effects.js";

const DISPLAY_FONT = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
const BODY_FONT = '"Trebuchet MS", "Gill Sans", "Segoe UI", sans-serif';

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawCoverImage(context, source, x, y, width, height) {
  const sourceRatio = source.width / source.height;
  const targetRatio = width / height;

  let sx = 0;
  let sy = 0;
  let sw = source.width;
  let sh = source.height;

  if (sourceRatio > targetRatio) {
    sw = source.height * targetRatio;
    sx = (source.width - sw) / 2;
  } else {
    sh = source.width / targetRatio;
    sy = (source.height - sh) / 2;
  }

  context.drawImage(source, sx, sy, sw, sh, x, y, width, height);
}

function drawPhotoCard(context, photoCanvas, frame) {
  const {
    x,
    y,
    width,
    height,
    radius = 28,
    borderColor = "rgba(0, 0, 0, 0.08)",
    frameColor = "#ffffff",
    shadowColor = "rgba(0, 0, 0, 0.16)",
    padding = 16,
    strokeWidth = 2,
  } = frame;

  context.save();
  context.shadowColor = shadowColor;
  context.shadowBlur = 26;
  context.shadowOffsetY = 12;
  context.fillStyle = frameColor;
  roundedRectPath(context, x, y, width, height, radius);
  context.fill();
  context.restore();

  context.save();
  context.fillStyle = borderColor;
  roundedRectPath(context, x, y, width, height, radius);
  context.strokeStyle = borderColor;
  context.lineWidth = strokeWidth;
  context.stroke();

  roundedRectPath(
    context,
    x + padding,
    y + padding,
    width - padding * 2,
    height - padding * 2,
    radius - 10,
  );
  context.clip();
  drawCoverImage(
    context,
    photoCanvas,
    x + padding,
    y + padding,
    width - padding * 2,
    height - padding * 2,
  );
  context.restore();
}

function drawBadge(context, text, x, y, background, textColor) {
  context.save();
  context.font = `700 28px ${BODY_FONT}`;
  const width = context.measureText(text).width + 34;
  const height = 50;
  roundedRectPath(context, x, y, width, height, 999);
  context.fillStyle = background;
  context.fill();
  context.fillStyle = textColor;
  context.textBaseline = "middle";
  context.fillText(text, x + 17, y + height / 2);
  context.restore();
}

function drawStar(context, x, y, radius, color) {
  context.save();
  context.translate(x, y);
  context.beginPath();

  for (let point = 0; point < 10; point += 1) {
    const angle = -Math.PI / 2 + point * (Math.PI / 5);
    const length = point % 2 === 0 ? radius : radius * 0.42;
    const px = Math.cos(angle) * length;
    const py = Math.sin(angle) * length;

    if (point === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  }

  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function drawHeart(context, x, y, size, color) {
  context.save();
  context.translate(x, y);
  context.scale(size / 100, size / 100);
  context.beginPath();
  context.moveTo(0, 28);
  context.bezierCurveTo(-48, -12, -62, 38, 0, 76);
  context.bezierCurveTo(62, 38, 48, -12, 0, 28);
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function drawPartyHat(context, x, y, width, height, color) {
  context.save();
  context.beginPath();
  context.moveTo(x + width / 2, y);
  context.lineTo(x + width, y + height);
  context.lineTo(x, y + height);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = "rgba(29, 21, 28, 0.28)";
  context.lineWidth = 8;
  context.stroke();

  context.fillStyle = "#fff4de";
  for (let index = 0; index < 3; index += 1) {
    context.fillRect(x + 26 + index * 46, y + height - 42 - index * 36, 34, 12);
  }

  context.beginPath();
  context.arc(x + width / 2, y - 8, 18, 0, Math.PI * 2);
  context.fillStyle = "#ffd166";
  context.fill();
  context.restore();
}

function drawSunglasses(context, x, y, scale = 1) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.fillStyle = "#1d151c";
  roundedRectPath(context, 0, 0, 72, 48, 18);
  context.fill();
  roundedRectPath(context, 94, 0, 72, 48, 18);
  context.fill();
  context.fillRect(68, 18, 30, 10);
  context.strokeStyle = "#ff79ba";
  context.lineWidth = 7;
  context.strokeRect(5, 5, 62, 38);
  context.strokeRect(99, 5, 62, 38);
  context.restore();
}

function drawTape(context, x, y, angle, color) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  roundedRectPath(context, -58, -18, 116, 36, 8);
  context.fillStyle = color;
  context.globalAlpha = 0.82;
  context.fill();
  context.restore();
}

function drawRotatedLabel(context, text, x, y, width, height, angle, color, textColor) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  roundedRectPath(context, -width / 2, -height / 2, width, height, 16);
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = "rgba(29, 21, 28, 0.16)";
  context.lineWidth = 4;
  context.stroke();
  context.fillStyle = textColor;
  context.font = `800 28px ${BODY_FONT}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 0, 2);
  context.restore();
}

function drawBolt(context, x, y, scale, color) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.beginPath();
  context.moveTo(18, 0);
  context.lineTo(-22, 54);
  context.lineTo(8, 54);
  context.lineTo(-12, 112);
  context.lineTo(42, 40);
  context.lineTo(10, 40);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function drawRing(context, x, y, radius, color, lineWidth = 8) {
  context.save();
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.restore();
}

function drawFlower(context, x, y, size, petalColor, centerColor) {
  context.save();
  context.translate(x, y);
  for (let index = 0; index < 6; index += 1) {
    const angle = (Math.PI * 2 * index) / 6;
    context.beginPath();
    context.ellipse(
      Math.cos(angle) * size * 0.36,
      Math.sin(angle) * size * 0.36,
      size * 0.24,
      size * 0.38,
      angle,
      0,
      Math.PI * 2,
    );
    context.fillStyle = petalColor;
    context.fill();
  }

  context.beginPath();
  context.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  context.fillStyle = centerColor;
  context.fill();
  context.restore();
}

function drawLeaf(context, x, y, size, angle, color) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.beginPath();
  context.ellipse(0, 0, size * 0.32, size * 0.72, 0, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = "rgba(29, 21, 28, 0.14)";
  context.lineWidth = 4;
  context.stroke();
  context.restore();
}

function drawBurst(context, x, y, radius, fillColor, strokeColor) {
  context.save();
  context.translate(x, y);
  context.beginPath();
  for (let point = 0; point < 20; point += 1) {
    const angle = -Math.PI / 2 + point * (Math.PI / 10);
    const length = point % 2 === 0 ? radius : radius * 0.68;
    const px = Math.cos(angle) * length;
    const py = Math.sin(angle) * length;

    if (point === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  }

  context.closePath();
  context.fillStyle = fillColor;
  context.fill();
  context.strokeStyle = strokeColor;
  context.lineWidth = 8;
  context.stroke();
  context.restore();
}

function drawSpeechBubble(context, text, x, y, width, height, fillColor, textColor) {
  context.save();
  roundedRectPath(context, x, y, width, height, 24);
  context.fillStyle = fillColor;
  context.fill();
  context.beginPath();
  context.moveTo(x + 58, y + height - 2);
  context.lineTo(x + 34, y + height + 38);
  context.lineTo(x + 104, y + height - 2);
  context.closePath();
  context.fill();
  context.strokeStyle = "rgba(29, 21, 28, 0.18)";
  context.lineWidth = 5;
  context.stroke();
  context.fillStyle = textColor;
  context.font = `900 36px ${DISPLAY_FONT}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, x + width / 2, y + height / 2 + 2);
  context.restore();
}

function drawPostmark(context, x, y, radius, color) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 6;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.arc(x, y, radius * 0.72, 0, Math.PI * 2);
  context.stroke();
  for (let index = 0; index < 4; index += 1) {
    const lineY = y - 36 + index * 22;
    context.beginPath();
    context.moveTo(x + radius + 22, lineY);
    context.lineTo(x + radius + 156, lineY - 12);
    context.stroke();
  }
  context.restore();
}

function drawRibbon(context, x, y, width, height, angle, color) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillStyle = color;
  roundedRectPath(context, -width / 2, -height / 2, width, height, 8);
  context.fill();
  context.beginPath();
  context.moveTo(width / 2 - 2, -height / 2);
  context.lineTo(width / 2 + 44, -height / 2);
  context.lineTo(width / 2 + 22, 0);
  context.lineTo(width / 2 + 44, height / 2);
  context.lineTo(width / 2 - 2, height / 2);
  context.closePath();
  context.fill();
  context.beginPath();
  context.moveTo(-width / 2 + 2, -height / 2);
  context.lineTo(-width / 2 - 44, -height / 2);
  context.lineTo(-width / 2 - 22, 0);
  context.lineTo(-width / 2 - 44, height / 2);
  context.lineTo(-width / 2 + 2, height / 2);
  context.closePath();
  context.fill();
  context.restore();
}

function drawPixelBlock(context, x, y, units, unitSize, color) {
  context.save();
  context.fillStyle = color;
  units.forEach(([column, row]) => {
    context.fillRect(x + column * unitSize, y + row * unitSize, unitSize, unitSize);
  });
  context.restore();
}

function drawPixelHeart(context, x, y, unitSize, color) {
  drawPixelBlock(
    context,
    x,
    y,
    [
      [1, 0],
      [2, 0],
      [4, 0],
      [5, 0],
      [0, 1],
      [3, 1],
      [6, 1],
      [0, 2],
      [6, 2],
      [1, 3],
      [5, 3],
      [2, 4],
      [4, 4],
      [3, 5],
    ],
    unitSize,
    color,
  );
}

function drawChromeBubble(context, x, y, radius, color) {
  const gradient = context.createRadialGradient(
    x - radius * 0.32,
    y - radius * 0.36,
    radius * 0.12,
    x,
    y,
    radius,
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.28, color);
  gradient.addColorStop(1, "rgba(31, 37, 46, 0.28)");

  context.save();
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = gradient;
  context.fill();
  context.strokeStyle = "rgba(255, 255, 255, 0.72)";
  context.lineWidth = 5;
  context.stroke();
  context.restore();
}

function drawStickerDecor(context, width, height, stickerPack, accent) {
  if (!stickerPack || stickerPack.kind === "none") {
    return;
  }

  if (stickerPack.kind === "sparkle") {
    drawStar(context, width - 176, 176, 42, "#ffd166");
    drawStar(context, width - 106, 260, 24, "#55dfc8");
    drawStar(context, 118, height - 210, 34, accent);
    drawStar(context, width - 160, height - 136, 30, "#fff4de");
    return;
  }

  if (stickerPack.kind === "party") {
    drawPartyHat(context, width - 254, 86, 144, 178, "#ff79ba");
    drawSunglasses(context, 124, height - 196, 0.92);
    drawBadge(context, "PARTY", width - 286, height - 150, "#1d151c", "#fff4de");
    return;
  }

  if (stickerPack.kind === "cute") {
    drawHeart(context, width - 180, 152, 92, "#ff79ba");
    drawHeart(context, 126, height - 212, 72, "#ff7a59");
    drawTape(context, 176, 96, -0.16, "#8bf0a1");
    drawTape(context, width - 174, height - 98, 0.15, "#f4d7ff");
    return;
  }

  if (stickerPack.kind === "date") {
    const stampDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date()).toUpperCase();

    drawRotatedLabel(context, stampDate, width - 184, 128, 206, 68, 0.12, "#ffffff", "#2f5f9f");
    drawPostmark(context, 164, height - 166, 58, "#2f5f9f");
    drawBadge(context, "ARCHIVE", width - 302, height - 132, "#2f5f9f", "#fffaf2");
    return;
  }

  if (stickerPack.kind === "labels") {
    drawRotatedLabel(context, "GOOD TIMES", 188, 118, 244, 66, -0.12, "#e6bd68", "#1d151c");
    drawRotatedLabel(context, "KEEP THIS", width - 190, height - 114, 214, 58, 0.1, "#fff4de", "#1d151c");
    drawTape(context, width - 190, 104, 0.16, "#1d151c");
    drawTape(context, 168, height - 92, -0.14, "#ff7a59");
    return;
  }

  if (stickerPack.kind === "neon") {
    context.save();
    context.shadowColor = "#6ff6ff";
    context.shadowBlur = 20;
    drawRing(context, 152, height - 170, 54, "#6ff6ff", 9);
    drawRing(context, 216, height - 118, 32, "#ff5ad0", 8);
    drawBolt(context, width - 198, 106, 1.02, "#ffd166");
    context.strokeStyle = "#ff5ad0";
    context.lineWidth = 10;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(width - 308, height - 148);
    context.bezierCurveTo(width - 248, height - 210, width - 190, height - 82, width - 116, height - 144);
    context.stroke();
    context.restore();
    return;
  }

  if (stickerPack.kind === "bloom") {
    drawFlower(context, width - 156, 150, 92, "#ffb6d5", "#ffd166");
    drawFlower(context, 132, height - 182, 78, "#fff4a3", "#3bb273");
    drawLeaf(context, width - 240, 184, 78, -0.9, "#3bb273");
    drawLeaf(context, 210, height - 164, 70, 0.86, "#8bf0a1");
    drawLeaf(context, 118, height - 104, 54, -0.55, "#3bb273");
    return;
  }

  if (stickerPack.kind === "comic") {
    drawBurst(context, width - 164, 156, 88, "#ffd166", "#1d151c");
    context.save();
    context.fillStyle = "#1d151c";
    context.font = `900 44px ${DISPLAY_FONT}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("POP!", width - 164, 158);
    context.restore();
    drawSpeechBubble(context, "SNAP", 96, height - 238, 188, 82, "#ffffff", "#ff3f5f");
    return;
  }

  if (stickerPack.kind === "travel") {
    drawPostmark(context, width - 214, 152, 62, "#3b82f6");
    drawRotatedLabel(context, "POSTCARD", 170, 128, 230, 62, -0.08, "#fff4de", "#2f5f9f");
    drawBadge(context, "MOMENT", width - 304, height - 136, "#3b82f6", "#fffaf2");
    drawRing(context, 150, height - 152, 46, "#f6bd38", 8);
    return;
  }

  if (stickerPack.kind === "ribbon") {
    drawRibbon(context, width - 206, 122, 230, 52, 0.18, "#b35cff");
    drawRibbon(context, 174, height - 120, 244, 50, -0.14, "#12b7a6");
    drawRotatedLabel(context, "XO", width - 160, height - 198, 96, 58, -0.1, "#fffaf2", "#b35cff");
    return;
  }

  if (stickerPack.kind === "minimal") {
    context.save();
    context.strokeStyle = "rgba(31, 37, 46, 0.42)";
    context.lineWidth = 4;
    context.setLineDash([20, 16]);
    roundedRectPath(context, 54, 54, width - 108, height - 108, 26);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = accent;
    [112, 154, 196].forEach((dotX) => {
      context.beginPath();
      context.arc(dotX, 126, 9, 0, Math.PI * 2);
      context.fill();
    });
    [width - 112, width - 154, width - 196].forEach((dotX) => {
      context.beginPath();
      context.arc(dotX, height - 126, 9, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
    return;
  }

  if (stickerPack.kind === "pixel") {
    drawPixelHeart(context, width - 238, 94, 18, "#ff3f5f");
    drawPixelHeart(context, 112, height - 204, 14, "#12b7a6");
    drawPixelBlock(
      context,
      width - 164,
      height - 156,
      [
        [2, 0],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
        [2, 3],
        [2, 4],
      ],
      16,
      "#ffd166",
    );
    return;
  }

  if (stickerPack.kind === "chrome") {
    drawChromeBubble(context, width - 164, 150, 58, "#9e84ff");
    drawChromeBubble(context, width - 102, 238, 34, "#6ff6ff");
    drawChromeBubble(context, 142, height - 174, 48, "#ff79ba");
    drawRing(context, 218, height - 118, 42, "rgba(158, 132, 255, 0.72)", 7);
  }
}

function drawFooterMeta(context, x, y, width, stylePreset, template) {
  const createdOn = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  context.save();
  context.fillStyle = template.textColor ?? "rgba(28, 20, 26, 0.76)";
  context.font = `700 34px ${DISPLAY_FONT}`;
  context.fillText("PHOTOBOOTH", x, y);
  context.fillStyle = template.mutedColor ?? "rgba(28, 20, 26, 0.7)";
  context.font = `600 24px ${BODY_FONT}`;
  context.fillText(`${stylePreset.name} / ${template.name}`, x, y + 46);
  context.fillText(createdOn, x, y + 84);
  context.restore();
}

function drawFilmRails(context, width, height, template) {
  const railWidth = 120;
  const holeWidth = 48;
  const holeHeight = 34;
  const holeGap = 80;
  const holeColor = "rgba(252, 239, 214, 0.86)";

  context.save();
  context.fillStyle = template.railColor ?? "#060606";
  context.fillRect(0, 0, railWidth, height);
  context.fillRect(width - railWidth, 0, railWidth, height);

  context.fillStyle = holeColor;
  for (let y = 88; y < height - 88; y += holeGap) {
    roundedRectPath(context, 34, y, holeWidth, holeHeight, 8);
    context.fill();
    roundedRectPath(context, width - 82, y, holeWidth, holeHeight, 8);
    context.fill();
  }

  context.strokeStyle = template.borderColor ?? "rgba(230, 189, 104, 0.5)";
  context.lineWidth = 4;
  context.strokeRect(136, 72, width - 272, height - 144);
  context.restore();
}

function drawClassicStrip(context, width, height, photos, stylePreset, template, stickerPack) {
  context.fillStyle = template.background;
  context.fillRect(0, 0, width, height);

  const isFilmRoll = template.variant === "film-roll";
  const textColor = template.textColor ?? "#1d151c";
  const mutedColor = template.mutedColor ?? "rgba(29, 21, 28, 0.68)";
  const stripeColor = template.stripeColor ?? template.accent;

  if (isFilmRoll) {
    drawFilmRails(context, width, height, template);
  } else {
    context.fillStyle = textColor;
    context.fillRect(72, 72, 18, height - 144);

    context.fillStyle = stripeColor;
    context.fillRect(108, 72, 10, height - 144);
  }

  context.fillStyle = textColor;
  context.font = `900 110px ${DISPLAY_FONT}`;
  context.fillText("PHOTOBOOTH", isFilmRoll ? 168 : 152, 160);
  context.font = `700 34px ${BODY_FONT}`;
  context.fillStyle = mutedColor;
  context.fillText(`${photos.length} FRAMES / ONE PRINT`, isFilmRoll ? 172 : 156, 205);

  const top = 258;
  const bottom = 180;
  const side = isFilmRoll ? 174 : 136;
  const gap = 34;
  const cardHeight = (height - top - bottom - gap * (photos.length - 1)) / photos.length;

  photos.forEach((photoCanvas, index) => {
    const y = top + index * (cardHeight + gap);
    drawPhotoCard(context, photoCanvas, {
      x: side,
      y,
      width: width - side * 2,
      height: cardHeight,
      radius: isFilmRoll ? 18 : 30,
      frameColor: template.frameColor ?? "#fffaf2",
      borderColor: template.borderColor ?? "rgba(29, 21, 28, 0.08)",
      shadowColor: isFilmRoll ? "rgba(0, 0, 0, 0.34)" : "rgba(0, 0, 0, 0.18)",
      padding: isFilmRoll ? 12 : 16,
      strokeWidth: isFilmRoll ? 3 : 4,
    });

    drawBadge(
      context,
      `SHOT ${index + 1}`,
      width - side - 176,
      y + 24,
      isFilmRoll ? template.accent : "rgba(29, 21, 28, 0.78)",
      isFilmRoll ? "#171514" : "#fff4de",
    );
  });

  drawStickerDecor(context, width, height, stickerPack, template.accent);
  drawFooterMeta(context, isFilmRoll ? 170 : 154, height - 108, width - 308, stylePreset, template);
}

function drawNeonGrid(context, width, height, photos, stylePreset, template) {
  const backgroundGradient = context.createLinearGradient(0, 0, width, height);
  backgroundGradient.addColorStop(0, "#110c1f");
  backgroundGradient.addColorStop(1, "#1b1230");
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(114, 246, 255, 0.16)";
  context.lineWidth = 3;
  context.strokeRect(48, 48, width - 96, height - 96);

  context.fillStyle = "#fff8ea";
  context.font = `900 108px ${DISPLAY_FONT}`;
  context.fillText("NIGHT GRID", 110, 168);
  context.font = `700 30px ${BODY_FONT}`;
  context.fillStyle = "rgba(255, 248, 234, 0.82)";
  context.fillText(`${stylePreset.name} mode active`, 112, 212);

  const padding = 110;
  const header = 280;
  const footer = 112;
  const gap = 42;
  const cardSize = (width - padding * 2 - gap) / 2;
  const startY = header;

  photos.forEach((photoCanvas, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = padding + column * (cardSize + gap);
    const y = startY + row * (cardSize + gap);

    context.save();
    context.shadowColor = "rgba(114, 246, 255, 0.28)";
    context.shadowBlur = 36;
    context.shadowOffsetY = 10;
    roundedRectPath(context, x, y, cardSize, cardSize, 34);
    context.fillStyle = "rgba(255, 255, 255, 0.08)";
    context.fill();
    context.restore();

    drawPhotoCard(context, photoCanvas, {
      x,
      y,
      width: cardSize,
      height: cardSize,
      radius: 34,
      frameColor: "#171123",
      borderColor: "rgba(114, 246, 255, 0.34)",
      shadowColor: "rgba(8, 4, 15, 0.34)",
    });
  });

  drawBadge(
    context,
    "SAVE THE MOMENT",
    112,
    height - footer,
    "rgba(255, 255, 255, 0.08)",
    "#fff8ea",
  );

  context.fillStyle = "rgba(255, 248, 234, 0.76)";
  context.font = `600 26px ${BODY_FONT}`;
  context.fillText(template.name, width - 310, height - 58);
}

function drawEditorialPoster(context, width, height, photos, stylePreset, template) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f0e2cd");
  gradient.addColorStop(1, "#f8f1e6");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#1e141b";
  context.font = `900 112px ${DISPLAY_FONT}`;
  context.fillText("POSTER MODE", 84, 138);
  context.font = `700 28px ${BODY_FONT}`;
  context.fillText("A hero shot with supporting moments", 88, 182);

  drawPhotoCard(context, photos[0], {
    x: 84,
    y: 234,
    width: 940,
    height: 948,
    radius: 34,
    frameColor: "#fffaf2",
    borderColor: "rgba(30, 20, 27, 0.12)",
    shadowColor: "rgba(0, 0, 0, 0.18)",
  });

  const sideX = 1070;
  const sideWidth = 646;
  const sideHeight = 258;
  const sideGap = 24;

  photos.slice(1).forEach((photoCanvas, index) => {
    const y = 236 + index * (sideHeight + sideGap);
    drawPhotoCard(context, photoCanvas, {
      x: sideX,
      y,
      width: sideWidth,
      height: sideHeight,
      radius: 26,
      frameColor: "#fffaf2",
      borderColor: "rgba(30, 20, 27, 0.12)",
      shadowColor: "rgba(0, 0, 0, 0.14)",
    });
  });

  roundedRectPath(context, 1070, 1048, 646, 136, 28);
  context.fillStyle = "#1e141b";
  context.fill();

  context.fillStyle = "#fff2de";
  context.font = `900 54px ${DISPLAY_FONT}`;
  context.fillText(stylePreset.name.toUpperCase(), 1108, 1108);
  context.font = `600 26px ${BODY_FONT}`;
  context.fillText(template.description, 1108, 1146);

  context.fillStyle = template.accent;
  context.fillRect(84, 1200, width - 168, 14);
}

function drawLayout(context, width, height, photos, stylePreset, template, stickerPack) {
  if (template.layout === "grid") {
    drawNeonGrid(context, width, height, photos, stylePreset, template);
    return;
  }

  if (template.layout === "poster") {
    drawEditorialPoster(context, width, height, photos, stylePreset, template);
    return;
  }

  drawClassicStrip(context, width, height, photos, stylePreset, template, stickerPack);
}

function createDynamicTemplate(photoCount, stylePreset) {
  const printTheme = stylePreset.printTheme ?? {};

  return {
    name: `${photoCount} Photo Print`,
    description: "A focused booth print sized to the selected photo count.",
    variant: printTheme.variant ?? "classic",
    accent: printTheme.accent ?? stylePreset.accent ?? "#ff7a59",
    background: printTheme.background ?? "#f8f0e0",
    frameColor: printTheme.frameColor ?? "#fffaf2",
    borderColor: printTheme.borderColor ?? "rgba(29, 21, 28, 0.08)",
    textColor: printTheme.textColor ?? "#1d151c",
    mutedColor: printTheme.mutedColor ?? "rgba(29, 21, 28, 0.68)",
    stripeColor: printTheme.stripeColor,
    railColor: printTheme.railColor,
    canvas: {
      width: 1200,
      height: 900 + photoCount * 275,
    },
    layout: "strip",
  };
}

export function captureRawFrame(videoElement, options = {}) {
  const { mirror = true } = options;

  if (!videoElement.videoWidth || !videoElement.videoHeight) {
    throw new Error("The camera preview is not ready yet.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const context = canvas.getContext("2d");

  if (mirror) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }

  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  return canvas;
}

export function renderBoothPrint({ targetCanvas, shots, stylePreset, stickerPack }) {
  const photos = shots.map((shot) => createStyledCanvas(shot, stylePreset));
  const template = createDynamicTemplate(photos.length, stylePreset);
  targetCanvas.width = template.canvas.width;
  targetCanvas.height = template.canvas.height;

  const context = targetCanvas.getContext("2d");
  drawLayout(
    context,
    targetCanvas.width,
    targetCanvas.height,
    photos,
    stylePreset,
    template,
    stickerPack,
  );
}

export function canvasToBlob(canvas, type = "image/png", quality = 0.95) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("The print could not be exported."));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}
