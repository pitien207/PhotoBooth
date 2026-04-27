export const stickerPacks = [
  {
    id: "none",
    name: "No Sticker",
    label: "Sach gon",
    description: "Giu ban in gon, khong them phu kien.",
    kind: "none",
    accent: "#f7efe2",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
  },
  {
    id: "sparkle",
    name: "Sparkle",
    label: "Sao sang",
    description: "Them sao va diem sang quanh khung anh.",
    kind: "sparkle",
    accent: "#ffd166",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,209,102,0.28), rgba(85,223,200,0.14))",
  },
  {
    id: "party-props",
    name: "Party Props",
    label: "Kinh + non",
    description: "Phu kien tiec nho tren ban in.",
    kind: "party",
    accent: "#ff79ba",
    swatchBackground:
      "linear-gradient(135deg, rgba(255,121,186,0.26), rgba(255,122,89,0.18))",
  },
  {
    id: "cute-notes",
    name: "Cute Notes",
    label: "Tim + tape",
    description: "Sticker trai tim va bang dinh trang tri.",
    kind: "cute",
    accent: "#8bf0a1",
    swatchBackground:
      "linear-gradient(135deg, rgba(139,240,161,0.22), rgba(244,215,255,0.18))",
  },
];

export function getStickerPack(stickerId) {
  return stickerPacks.find((pack) => pack.id === stickerId) ?? stickerPacks[0];
}
