import { stylePresets, getStylePreset } from "./data/styles.js";
import { photoCountOptions, getPhotoCountOption } from "./data/photo-counts.js";
import { countdownOptions, getCountdownOption } from "./data/countdowns.js";
import { stickerPacks, getStickerPack } from "./data/stickers.js";
import { setState, state } from "./state.js";
import {
  describeCameraError,
  getMirrorMode,
  startCamera,
  stopCamera,
} from "./modules/camera.js";
import { runBoothSequence } from "./modules/capture-session.js";
import {
  canvasToBlob,
  captureRawFrame,
  renderBoothPrint,
} from "./modules/renderer.js";
import {
  renderCountdownCards,
  renderPhotoCountCards,
  renderShotTray,
  renderStyleCards,
  renderStickerCards,
  setResultVisibility,
  setStatus,
} from "./modules/ui.js";

const elements = {
  startCameraButton: document.querySelector("#startCameraButton"),
  switchCameraButton: document.querySelector("#switchCameraButton"),
  captureButton: document.querySelector("#captureButton"),
  retakeButton: document.querySelector("#retakeButton"),
  downloadButton: document.querySelector("#downloadButton"),
  controlsTitle: document.querySelector("#controls-title"),
  panelIntro: document.querySelector(".control-panel .panel-intro"),
  photoCountGrid: document.querySelector("#photoCountGrid"),
  countdownGrid: document.querySelector("#countdownGrid"),
  styleGrid: document.querySelector("#styleGrid"),
  stickerGrid: document.querySelector("#stickerGrid"),
  cameraPreview: document.querySelector("#cameraPreview"),
  videoFallback: document.querySelector("#videoFallback"),
  countdownOverlay: document.querySelector("#countdownOverlay"),
  shotMarker: document.querySelector("#shotMarker"),
  stageHint: document.querySelector("#stageHint"),
  shotTray: document.querySelector("#shotTray"),
  resultCanvas: document.querySelector("#resultCanvas"),
  resultPlaceholder: document.querySelector("#resultPlaceholder"),
  resultTitle: document.querySelector("#resultTitle"),
  statusChip: document.querySelector("#statusChip"),
};

function getSelectedShotCount() {
  return getPhotoCountOption(state.selectedPhotoCountId).count;
}

function getSelectedCountdownSeconds() {
  return getCountdownOption(state.selectedCountdownId).seconds;
}

function updateViewMode() {
  const isEditMode = state.viewMode === "edit";
  document.body.classList.toggle("is-edit-mode", isEditMode);
  document.body.classList.toggle("is-capture-mode", !isEditMode);
  elements.controlsTitle.textContent = isEditMode ? "Edit" : "Capture";
  elements.panelIntro.textContent = isEditMode
    ? "Style, sticker, download."
    : "Count, timer, camera, action.";
}

function restartCountdownAnimation() {
  elements.countdownOverlay.classList.remove("is-animating");
  void elements.countdownOverlay.offsetWidth;
  elements.countdownOverlay.classList.add("is-animating");
}

function showCountdown(value) {
  elements.countdownOverlay.hidden = false;
  elements.countdownOverlay.textContent = String(value);
  restartCountdownAnimation();
}

function hideCountdown() {
  elements.countdownOverlay.hidden = true;
  elements.countdownOverlay.classList.remove("is-animating");
}

function buildFileName(styleId, stickerId, shotCount) {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `photobooth-${timestamp}-${shotCount}-photos-${styleId}-${stickerId}.png`;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function applyPreviewStyle() {
  const stylePreset = getStylePreset(state.selectedStyleId);
  elements.cameraPreview.style.filter =
    state.viewMode === "edit" ? stylePreset.previewFilter : "none";
  elements.cameraPreview.style.transform = state.mirrorPreview
    ? "scaleX(-1)"
    : "scaleX(1)";
}

function updateButtons() {
  const hasCamera = state.cameraReady;
  const hasResult = Boolean(state.currentResult);
  const isBusy = state.isCapturing;

  const isEditMode = state.viewMode === "edit";

  elements.startCameraButton.disabled = isBusy || isEditMode;
  elements.switchCameraButton.disabled = isBusy || isEditMode;
  elements.captureButton.disabled = isBusy || isEditMode;
  elements.retakeButton.disabled = isBusy;
  elements.downloadButton.disabled = !hasResult || isBusy;

  elements.startCameraButton.textContent = hasCamera ? "Restart Camera" : "Start Camera";
  elements.captureButton.textContent = isBusy
    ? "Capturing..."
    : `Take ${getSelectedShotCount()} Photos`;
  elements.retakeButton.textContent = "Back to Camera";
}

function updateStageCopy(message) {
  elements.stageHint.textContent = message;
}

function updateShotMarker(message) {
  elements.shotMarker.textContent = message;
}

function refreshOptionCards() {
  renderPhotoCountCards(
    elements.photoCountGrid,
    photoCountOptions,
    state.selectedPhotoCountId,
    handlePhotoCountPick,
  );
  renderCountdownCards(
    elements.countdownGrid,
    countdownOptions,
    state.selectedCountdownId,
    handleCountdownPick,
  );
  renderStyleCards(elements.styleGrid, stylePresets, state.selectedStyleId, handleStylePick);
  renderStickerCards(elements.stickerGrid, stickerPacks, state.selectedStickerId, handleStickerPick);
}

function resetCurrentWorkspace() {
  setState({
    captures: [],
    currentResult: null,
    viewMode: "capture",
  });

  updateViewMode();
  applyPreviewStyle();
  renderShotTray(elements.shotTray, [], getSelectedShotCount());
  setResultVisibility(elements.resultCanvas, elements.resultPlaceholder, false);
  elements.resultTitle.textContent = "Your booth strip";
  updateShotMarker(`Ready for shot 1 of ${getSelectedShotCount()}`);
  hideCountdown();
  updateButtons();
}

async function ensureCameraReady() {
  try {
    stopCamera(state.stream);

    const stream = await startCamera(elements.cameraPreview, state.facingMode);
    const mirrorPreview = getMirrorMode(stream, state.facingMode);

    setState({
      stream,
      cameraReady: true,
      mirrorPreview,
    });

    elements.cameraPreview.classList.add("is-visible");
    elements.videoFallback.hidden = true;
    applyPreviewStyle();
    setStatus(
      elements.statusChip,
      `Camera is ready. Take ${getSelectedShotCount()} photos with a ${getSelectedCountdownSeconds()}s countdown.`,
      "ok",
    );
    updateStageCopy(
      "Camera is live. Choose photo count and countdown, then start the booth.",
    );
    updateButtons();
  } catch (error) {
    elements.cameraPreview.classList.remove("is-visible");
    elements.videoFallback.hidden = false;
    setState({
      stream: null,
      cameraReady: false,
    });
    setStatus(elements.statusChip, describeCameraError(error), "error");
    updateStageCopy("Open this page from localhost or HTTPS if the camera is blocked.");
    updateButtons();
    throw error;
  }
}

async function exportCurrentPrint() {
  const stylePreset = getStylePreset(state.selectedStyleId);
  const stickerPack = getStickerPack(state.selectedStickerId);
  const shotCount = getSelectedShotCount();

  renderBoothPrint({
    targetCanvas: elements.resultCanvas,
    shots: state.captures,
    stylePreset,
    stickerPack,
  });

  const blob = await canvasToBlob(elements.resultCanvas);
  const filename = buildFileName(stylePreset.id, stickerPack.id, shotCount);

  const currentResult = {
    blob,
    filename,
    styleName: stylePreset.name,
    templateName: `${shotCount} Photo Print / ${stickerPack.name}`,
  };

  setState({ currentResult });

  setResultVisibility(elements.resultCanvas, elements.resultPlaceholder, true);
  elements.resultTitle.textContent = `${shotCount} Photos / ${stylePreset.name}`;
  updateButtons();
}

async function captureSequence() {
  if (state.isCapturing) {
    return;
  }

  if (!state.cameraReady) {
    await ensureCameraReady();
  }

  setState({
    isCapturing: true,
    captures: [],
    currentResult: null,
  });
  const shotCount = getSelectedShotCount();
  const countdownSeconds = getSelectedCountdownSeconds();
  setStatus(
    elements.statusChip,
    `Capturing ${shotCount} photos with a ${countdownSeconds}s countdown.`,
    "warning",
  );
  setResultVisibility(elements.resultCanvas, elements.resultPlaceholder, false);
  renderShotTray(elements.shotTray, [], shotCount);
  updateButtons();

  try {
    const captures = await runBoothSequence({
      shotCount,
      countdownSeconds,
      onShotStart: (shotIndex) => {
        updateShotMarker(`Get ready for shot ${shotIndex + 1} of ${shotCount}`);
      },
      onCountdown: ({ shotIndex, totalShots, countdown, done }) => {
        if (done) {
          hideCountdown();
          updateShotMarker(`${totalShots} of ${totalShots} captured.`);
          return;
        }

        showCountdown(countdown);
        updateShotMarker(`Shot ${shotIndex + 1} of ${totalShots} in ${countdown}`);
      },
      onShotTaken: ({ shotIndex, shot }) => {
        hideCountdown();
        const updatedCaptures = [...state.captures, shot];
        setState({ captures: updatedCaptures });
        renderShotTray(elements.shotTray, updatedCaptures, shotCount);
        updateShotMarker(`Shot ${shotIndex + 1} locked in.`);
      },
      captureFrame: () =>
        captureRawFrame(elements.cameraPreview, {
          mirror: state.mirrorPreview,
        }),
    });

    setState({ captures });
    await exportCurrentPrint();
    setState({ viewMode: "edit" });
    updateViewMode();
    applyPreviewStyle();
    setStatus(
      elements.statusChip,
      "Edit mode is ready. Choose a print style or sticker before downloading.",
      "ok",
    );
    updateStageCopy("Back to Camera lets you capture a new set.");
  } catch (error) {
    const message =
      error?.message ?? "The booth sequence could not finish. Please try again.";
    setStatus(elements.statusChip, message, "error");
    updateStageCopy("The capture stopped early. Restart the camera and try again.");
  } finally {
    hideCountdown();
    setState({ isCapturing: false });
    updateButtons();
  }
}

function handleStylePick(styleId) {
  setState({ selectedStyleId: styleId });
  applyPreviewStyle();
  refreshOptionCards();

  if (state.captures.length === getSelectedShotCount()) {
    exportCurrentPrint()
      .catch((error) => {
        setStatus(
          elements.statusChip,
          error?.message ?? "The current print could not be refreshed.",
          "error",
        );
      });
  }
}

function handlePhotoCountPick(photoCountId) {
  setState({ selectedPhotoCountId: photoCountId });
  resetCurrentWorkspace();
  refreshOptionCards();
  setStatus(
    elements.statusChip,
    `Photo count set to ${getSelectedShotCount()}. Ready for a fresh capture.`,
    "warning",
  );
}

function handleCountdownPick(countdownId) {
  setState({ selectedCountdownId: countdownId });
  refreshOptionCards();
  setStatus(
    elements.statusChip,
    `Countdown set to ${getSelectedCountdownSeconds()}s.`,
    state.cameraReady ? "ok" : "warning",
  );
  updateButtons();
}

function handleStickerPick(stickerId) {
  setState({ selectedStickerId: stickerId });
  refreshOptionCards();

  if (state.captures.length === getSelectedShotCount()) {
    exportCurrentPrint()
      .then(() => {
        setStatus(
          elements.statusChip,
          "Sticker updated. Download the refreshed print when you are ready.",
          "ok",
        );
      })
      .catch((error) => {
        setStatus(
          elements.statusChip,
          error?.message ?? "The current print could not be refreshed.",
          "error",
        );
      });
  }
}

function handleDownload() {
  if (!state.currentResult) {
    return;
  }

  downloadBlob(state.currentResult.blob, state.currentResult.filename);
}

async function handleSwitchCamera() {
  if (state.isCapturing) {
    return;
  }

  const nextFacingMode = state.facingMode === "user" ? "environment" : "user";
  setState({ facingMode: nextFacingMode });
  updateStageCopy(
    nextFacingMode === "environment"
      ? "Switching to the outward camera."
      : "Switching back to the selfie camera.",
  );

  if (state.cameraReady) {
    try {
      await ensureCameraReady();
      setStatus(elements.statusChip, "Camera flipped successfully.", "ok");
    } catch {
      setState({ facingMode: state.facingMode === "user" ? "environment" : "user" });
    }
  }
}

function handleReset() {
  resetCurrentWorkspace();
  refreshOptionCards();
}

function initializeApp() {
  updateViewMode();
  refreshOptionCards();
  renderShotTray(elements.shotTray, [], getSelectedShotCount());
  applyPreviewStyle();
  hideCountdown();
  setResultVisibility(elements.resultCanvas, elements.resultPlaceholder, false);
  updateButtons();

  elements.startCameraButton.addEventListener("click", () => {
    ensureCameraReady().catch(() => undefined);
  });

  elements.switchCameraButton.addEventListener("click", () => {
    handleSwitchCamera().catch(() => undefined);
  });

  elements.captureButton.addEventListener("click", () => {
    captureSequence().catch(() => undefined);
  });

  elements.downloadButton.addEventListener("click", handleDownload);
  elements.retakeButton.addEventListener("click", handleReset);

  window.addEventListener("beforeunload", () => {
    stopCamera(state.stream);
  });
}

initializeApp();
