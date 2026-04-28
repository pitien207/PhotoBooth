export const stickerPacks = [
  {
    id: "none",
    name: "No Sticker",
    label: "Clean",
    description: "Keep the print simple.",
    kind: "none",
    accent: "#f7efe2",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
  },
  {
    id: "sparkle",
    name: "Sparkle",
    label: "Stars",
    description: "Add bright stars around the frame.",
    kind: "sparkle",
    accent: "#ffd166",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,209,102,0.28), rgba(85,223,200,0.14))",
  },
  {
    id: "party-props",
    name: "Party Props",
    label: "Glasses + hat",
    description: "A small party set on the print.",
    kind: "party",
    accent: "#ff79ba",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,121,186,0.26), rgba(255,122,89,0.18))",
  },
  {
    id: "cute-notes",
    name: "Cute Notes",
    label: "Hearts + tape",
    description: "Hearts and tape accents.",
    kind: "cute",
    accent: "#8bf0a1",
    swatchBackground:
      "linear-gradient(135deg, rgba(139,240,161,0.22), rgba(244,215,255,0.18))",
  },
  {
    id: "date-stamp",
    name: "Date Stamp",
    label: "Stamped",
    description: "A bold date stamp and frame marks.",
    kind: "date",
    accent: "#2f5f9f",
    swatchBackground:
      "linear-gradient(135deg, rgba(47,95,159,0.24), rgba(255,231,164,0.2))",
  },
  {
    id: "retro-labels",
    name: "Retro Labels",
    label: "Label tape",
    description: "Old-school sticker labels and corners.",
    kind: "labels",
    accent: "#e6bd68",
    swatchBackground:
      "linear-gradient(135deg, rgba(230,189,104,0.28), rgba(29,21,28,0.18))",
  },
  {
    id: "neon-doodles",
    name: "Neon Doodles",
    label: "Glow lines",
    description: "Neon scribbles, bolts, and rings.",
    kind: "neon",
    accent: "#6ff6ff",
    swatchBackground:
      "linear-gradient(135deg, rgba(106,246,255,0.24), rgba(255,90,208,0.22))",
  },
  {
    id: "bloom-corners",
    name: "Bloom Corners",
    label: "Flowers",
    description: "Soft flower and leaf corners.",
    kind: "bloom",
    accent: "#3bb273",
    swatchBackground:
      "linear-gradient(135deg, rgba(59,178,115,0.24), rgba(255,121,186,0.18))",
  },
  {
    id: "comic-pop",
    name: "Comic Pop",
    label: "Bursts",
    description: "Comic bursts and playful callouts.",
    kind: "comic",
    accent: "#ff3f5f",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,63,95,0.28), rgba(255,209,102,0.24))",
  },
  {
    id: "travel-stamps",
    name: "Travel Stamps",
    label: "Postcard",
    description: "Postmark rings and travel badges.",
    kind: "travel",
    accent: "#3b82f6",
    swatchBackground:
      "linear-gradient(135deg, rgba(59,130,246,0.24), rgba(246,189,56,0.18))",
  },
  {
    id: "ribbon-tags",
    name: "Ribbon Tags",
    label: "Ribbons",
    description: "Ribbon strips and gift-tag details.",
    kind: "ribbon",
    accent: "#b35cff",
    swatchBackground:
      "linear-gradient(135deg, rgba(179,92,255,0.23), rgba(18,183,166,0.18))",
  },
  {
    id: "minimal-lines",
    name: "Minimal Lines",
    label: "Fine line",
    description: "Thin graphic lines and simple dots.",
    kind: "minimal",
    accent: "#1f252e",
    swatchBackground:
      "linear-gradient(135deg, rgba(31,37,46,0.18), rgba(255,255,255,0.2))",
  },
  {
    id: "pixel-charms",
    name: "Pixel Charms",
    label: "8-bit",
    description: "Pixel stars, hearts, and tiny charms.",
    kind: "pixel",
    accent: "#12b7a6",
    swatchBackground:
      "linear-gradient(135deg, rgba(18,183,166,0.26), rgba(255,107,74,0.18))",
  },
  {
    id: "y2k-chrome",
    name: "Y2K Chrome",
    label: "Chrome",
    description: "Shiny bubbles and chrome-style marks.",
    kind: "chrome",
    accent: "#9e84ff",
    swatchBackground:
      "linear-gradient(135deg, rgba(158,132,255,0.26), rgba(111,246,255,0.2))",
  },
];

export function getStickerPack(stickerId) {
  return stickerPacks.find((pack) => pack.id === stickerId) ?? stickerPacks[0];
}
