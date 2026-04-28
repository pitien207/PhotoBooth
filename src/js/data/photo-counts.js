export const photoCountOptions = [
  {
    id: "two-photos",
    name: "2 Photos",
    label: "Quick pair",
    description: "Two frames for a compact print.",
    count: 2,
    accent: "#55dfc8",
    swatchBackground:
      "linear-gradient(135deg, rgba(85,223,200,0.24), rgba(255,255,255,0.05))",
  },
  {
    id: "three-photos",
    name: "3 Photos",
    label: "Balanced",
    description: "Three frames with a clean rhythm.",
    count: 3,
    accent: "#ffd166",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,209,102,0.26), rgba(255,255,255,0.05))",
  },
  {
    id: "four-photos",
    name: "4 Photos",
    label: "Classic set",
    description: "A four-frame photo booth strip.",
    count: 4,
    accent: "#ff7a59",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,122,89,0.28), rgba(255,255,255,0.05))",
  },
];

export function getPhotoCountOption(optionId) {
  return (
    photoCountOptions.find((option) => option.id === optionId) ??
    photoCountOptions[2]
  );
}
