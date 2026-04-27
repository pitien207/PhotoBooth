export const state = {
  stream: null,
  cameraReady: false,
  facingMode: "user",
  mirrorPreview: true,
  viewMode: "capture",
  selectedPhotoCountId: "four-photos",
  selectedCountdownId: "countdown-3",
  selectedStyleId: "sunset-party",
  selectedStickerId: "sparkle",
  captures: [],
  currentResult: null,
  isCapturing: false,
};

export function setState(patch) {
  Object.assign(state, patch);
  return state;
}
