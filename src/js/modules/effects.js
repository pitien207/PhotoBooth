const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (start, end, amount) => start + (end - start) * amount;

function hexToUnitRgb(hex) {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized;

  const value = Number.parseInt(expanded, 16);

  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

function applyPixelAdjustments(context, width, height, adjustments) {
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const brightness = adjustments.brightness ?? 1;
  const contrast = adjustments.contrast ?? 1;
  const saturation = adjustments.saturation ?? 1;
  const grayscale = adjustments.grayscale ?? 0;
  const sepia = adjustments.sepia ?? 0;
  const grain = adjustments.grain ?? 0;
  const tint = adjustments.tint ?? { r: 0, g: 0, b: 0, amount: 0 };
  const duotone = adjustments.duotone ?? null;
  const tintAmount = tint.amount ?? 0;
  const darkTone = duotone ? hexToUnitRgb(duotone.dark) : null;
  const lightTone = duotone ? hexToUnitRgb(duotone.light) : null;
  const duotoneAmount = duotone?.amount ?? 0;

  for (let index = 0; index < pixels.length; index += 4) {
    let red = (pixels[index] / 255) * brightness;
    let green = (pixels[index + 1] / 255) * brightness;
    let blue = (pixels[index + 2] / 255) * brightness;

    const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
    red = luminance + (red - luminance) * saturation;
    green = luminance + (green - luminance) * saturation;
    blue = luminance + (blue - luminance) * saturation;

    if (grayscale > 0) {
      red = mix(red, luminance, grayscale);
      green = mix(green, luminance, grayscale);
      blue = mix(blue, luminance, grayscale);
    }

    if (sepia > 0) {
      const sepiaRed = clamp(red * 0.393 + green * 0.769 + blue * 0.189);
      const sepiaGreen = clamp(red * 0.349 + green * 0.686 + blue * 0.168);
      const sepiaBlue = clamp(red * 0.272 + green * 0.534 + blue * 0.131);
      red = mix(red, sepiaRed, sepia);
      green = mix(green, sepiaGreen, sepia);
      blue = mix(blue, sepiaBlue, sepia);
    }

    red = (red - 0.5) * contrast + 0.5;
    green = (green - 0.5) * contrast + 0.5;
    blue = (blue - 0.5) * contrast + 0.5;

    if (tintAmount > 0) {
      red += tint.r * tintAmount;
      green += tint.g * tintAmount;
      blue += tint.b * tintAmount;
    }

    if (duotone && darkTone && lightTone) {
      const tone = clamp(0.299 * red + 0.587 * green + 0.114 * blue);
      const toneRed = mix(darkTone.r, lightTone.r, tone);
      const toneGreen = mix(darkTone.g, lightTone.g, tone);
      const toneBlue = mix(darkTone.b, lightTone.b, tone);
      red = mix(red, toneRed, duotoneAmount);
      green = mix(green, toneGreen, duotoneAmount);
      blue = mix(blue, toneBlue, duotoneAmount);
    }

    if (grain > 0) {
      const noise = (Math.random() - 0.5) * grain;
      red += noise;
      green += noise;
      blue += noise;
    }

    pixels[index] = Math.round(clamp(red) * 255);
    pixels[index + 1] = Math.round(clamp(green) * 255);
    pixels[index + 2] = Math.round(clamp(blue) * 255);
  }

  context.putImageData(imageData, 0, 0);
}

function paintOverlay(context, width, height, overlayName) {
  if (!overlayName || overlayName === "none") {
    return;
  }

  context.save();

  if (overlayName === "sunset") {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(255, 188, 120, 0.22)");
    gradient.addColorStop(0.45, "rgba(255, 112, 133, 0.12)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  if (overlayName === "candy") {
    const gradient = context.createRadialGradient(
      width * 0.78,
      height * 0.14,
      width * 0.08,
      width * 0.78,
      height * 0.14,
      width * 0.48,
    );
    gradient.addColorStop(0, "rgba(255, 112, 173, 0.22)");
    gradient.addColorStop(0.55, "rgba(113, 224, 255, 0.12)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  if (overlayName === "dream") {
    const gradient = context.createRadialGradient(
      width * 0.5,
      height * 0.28,
      width * 0.08,
      width * 0.5,
      height * 0.28,
      width * 0.58,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.22)");
    gradient.addColorStop(0.55, "rgba(255, 207, 235, 0.14)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  if (overlayName === "cyber") {
    const gradient = context.createLinearGradient(width, 0, 0, height);
    gradient.addColorStop(0, "rgba(255, 85, 211, 0.16)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(114, 246, 255, 0.16)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  context.restore();
}

function drawScanlines(context, width, height, amount) {
  if (!amount) {
    return;
  }

  context.save();
  context.strokeStyle = `rgba(5, 3, 10, ${0.14 + amount})`;
  context.lineWidth = 1;

  for (let y = 0; y < height; y += 4) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.restore();
}

function drawVignette(context, width, height, amount) {
  if (!amount) {
    return;
  }

  context.save();
  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.45,
    width * 0.2,
    width * 0.5,
    height * 0.45,
    width * 0.76,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.65, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, `rgba(0, 0, 0, ${amount})`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.restore();
}

export function createStyledCanvas(sourceCanvas, stylePreset) {
  const canvas = document.createElement("canvas");
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;

  const context = canvas.getContext("2d");

  context.drawImage(sourceCanvas, 0, 0);
  applyPixelAdjustments(
    context,
    canvas.width,
    canvas.height,
    stylePreset.adjustments,
  );
  paintOverlay(
    context,
    canvas.width,
    canvas.height,
    stylePreset.adjustments.overlay,
  );
  drawScanlines(
    context,
    canvas.width,
    canvas.height,
    stylePreset.adjustments.scanlines,
  );
  drawVignette(
    context,
    canvas.width,
    canvas.height,
    stylePreset.adjustments.vignette,
  );

  return canvas;
}
