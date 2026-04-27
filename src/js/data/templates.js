export const templates = [
  {
    id: "classic-strip",
    name: "Classic Strip",
    label: "Tall keepsake",
    description: "A vertical four-shot print with a bold date stamp.",
    accent: "#ff7a59",
    background: "#f8f0e0",
    canvas: { width: 1200, height: 2000 },
    layout: "strip",
  },
  {
    id: "neon-grid",
    name: "Neon Grid",
    label: "Square club board",
    description: "A 2x2 grid with glow edges and a darker night feel.",
    accent: "#55dfc8",
    background: "#110d1f",
    canvas: { width: 1600, height: 1600 },
    layout: "grid",
  },
  {
    id: "editorial-poster",
    name: "Editorial Poster",
    label: "Large hero frame",
    description: "One featured shot plus three side moments in a poster layout.",
    accent: "#ffd166",
    background: "#f0e2cd",
    canvas: { width: 1800, height: 1350 },
    layout: "poster",
  },
];

export function getTemplate(templateId) {
  return templates.find((template) => template.id === templateId) ?? templates[0];
}
