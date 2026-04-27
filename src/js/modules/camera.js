const BASE_CONSTRAINTS = {
  audio: false,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 960 },
  },
};

export async function startCamera(videoElement, facingMode = "user") {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera access is not supported in this browser.");
  }

  const preferredConstraints = {
    audio: false,
    video: {
      ...BASE_CONSTRAINTS.video,
      facingMode: { ideal: facingMode },
    },
  };

  let stream;

  try {
    stream = await navigator.mediaDevices.getUserMedia(preferredConstraints);
  } catch (error) {
    if (facingMode !== "user") {
      stream = await navigator.mediaDevices.getUserMedia(BASE_CONSTRAINTS);
    } else {
      throw error;
    }
  }

  videoElement.srcObject = stream;
  await waitForVideo(videoElement);

  return stream;
}

export function stopCamera(stream) {
  if (!stream) {
    return;
  }

  stream.getTracks().forEach((track) => track.stop());
}

export function getMirrorMode(stream, requestedFacingMode) {
  const track = stream?.getVideoTracks?.()[0];
  const facingMode = track?.getSettings?.().facingMode;

  if (facingMode === "environment") {
    return false;
  }

  if (facingMode === "user") {
    return true;
  }

  return requestedFacingMode !== "environment";
}

export function describeCameraError(error) {
  if (error?.name === "NotAllowedError") {
    return "Camera permission was denied. Allow access and try again.";
  }

  if (error?.name === "NotFoundError") {
    return "No camera was found on this device.";
  }

  if (error?.name === "NotReadableError") {
    return "The camera is busy in another app or unavailable right now.";
  }

  if (error?.name === "SecurityError") {
    return "This page needs a secure context such as localhost or HTTPS.";
  }

  if (error?.message) {
    return error.message;
  }

  return "The camera could not be started.";
}

function waitForVideo(videoElement) {
  if (videoElement.readyState >= 2) {
    return videoElement.play().catch(() => undefined);
  }

  return new Promise((resolve, reject) => {
    const handleLoaded = async () => {
      cleanup();

      try {
        await videoElement.play();
      } catch {
        // The preview is muted, so autoplay should normally succeed.
      }

      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error("The camera preview could not be loaded."));
    };

    const cleanup = () => {
      videoElement.removeEventListener("loadedmetadata", handleLoaded);
      videoElement.removeEventListener("error", handleError);
    };

    videoElement.addEventListener("loadedmetadata", handleLoaded, { once: true });
    videoElement.addEventListener("error", handleError, { once: true });
  });
}
