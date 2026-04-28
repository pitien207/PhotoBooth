export const countdownOptions = [
  {
    id: "countdown-1",
    name: "1s",
    label: "Fast",
    description: "Almost instant.",
    seconds: 1,
    accent: "#55dfc8",
    swatchBackground:
      "linear-gradient(135deg, rgba(85,223,200,0.26), rgba(255,255,255,0.05))",
  },
  {
    id: "countdown-3",
    name: "3s",
    label: "Default",
    description: "Enough time to pose.",
    seconds: 3,
    accent: "#ffd166",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,209,102,0.26), rgba(255,255,255,0.05))",
  },
  {
    id: "countdown-5",
    name: "5s",
    label: "Relaxed",
    description: "Extra time to get ready.",
    seconds: 5,
    accent: "#ff7a59",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,122,89,0.28), rgba(255,255,255,0.05))",
  },
];

export function getCountdownOption(optionId) {
  return (
    countdownOptions.find((option) => option.id === optionId) ??
    countdownOptions[1]
  );
}
