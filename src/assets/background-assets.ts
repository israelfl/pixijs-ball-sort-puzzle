export type backgroundAssetDef = {
  name: string;
  url: string;
  bgcolor: number;
  mode: string;
  title: string;
};

export const backgroundAssets = [
  {
    name: "bg-default",
    url: "./backgrounds/01.jpg",
    bgcolor: 0x0,
    mode: "tiled",
    title: "black",
  },
  {
    name: "bg-wood-sun",
    url: "./backgrounds/02.jpg",
    bgcolor: 0x2d1c1d,
    mode: "topcolor",
    title: "wood",
  },
  {
    name: "bg-sunset",
    url: "./backgrounds/03.jpg",
    bgcolor: 0x331913,
    mode: "topcolor",
    title: "sunset",
  },
  {
    name: "bg-tropical",
    url: "./backgrounds/04.jpg",
    bgcolor: 0x174f5a,
    mode: "topcolor",
    title: "tropical",
  },
  {
    name: "bg-night",
    url: "./backgrounds/05.jpg",
    bgcolor: 0x2e0f31,
    mode: "topcolor",
    title: "night",
  },
];
