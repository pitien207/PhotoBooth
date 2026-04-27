const delay = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

export async function runBoothSequence({
  captureFrame,
  onCountdown,
  onShotStart,
  onShotTaken,
  shotCount = 4,
  countdownSeconds = 3,
}) {
  const captures = [];

  for (let index = 0; index < shotCount; index += 1) {
    onShotStart?.(index);

    for (let second = countdownSeconds; second >= 1; second -= 1) {
      onCountdown?.({
        shotIndex: index,
        totalShots: shotCount,
        countdown: second,
      });
      await delay(1000);
    }

    const shot = captureFrame(index);
    captures.push(shot);
    onShotTaken?.({
      shotIndex: index,
      totalShots: shotCount,
      shot,
    });

    await delay(280);
  }

  onCountdown?.({
    shotIndex: shotCount,
    totalShots: shotCount,
    countdown: 0,
    done: true,
  });

  return captures;
}
