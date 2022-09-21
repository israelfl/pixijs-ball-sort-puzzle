import { DisplayObject, Text, TextStyle } from "pixi.js";
import { Sound } from "@pixi/sound";
import { cloneDeep } from "lodash";
import { gameSolver } from "./Solver";

export type tubesConfigDef = {
  tubeStack: number;
  circleColors: ballColorDef[];
  moves: number;
};
export type ballColorDef = {
  name: string;
  hexHtml: string;
  hex: string;
};

export type filledTubesDef = {
  totalMoves: number;
  tubesArray: Array<ballColorDef[]>;
};

export type resizeDef = {
  newWidth: number;
  newHeight: number;
  ratio: number;
};

export const circlesColors: ballColorDef[] = [
  { name: "blue", hexHtml: "#125580", hex: "125580" },
  { name: "green", hexHtml: "#007718", hex: "007718" },
  { name: "yellow", hexHtml: "#fffa03", hex: "fffa03" },
  { name: "red", hexHtml: "#dc3a29", hex: "dc3a29" },
  { name: "purple", hexHtml: "#8021a8", hex: "8021a8" },
  { name: "maroon", hexHtml: "#6E2C00", hex: "6e2c00" },
  { name: "gray", hexHtml: "#7e7e7e", hex: "7e7e7e" },
  { name: "pink", hexHtml: "#de54b1", hex: "de54b1" },
  { name: "sky", hexHtml: "#108ee4", hex: "108ee4" },
  { name: "lime", hexHtml: "#5cfa00", hex: "5cfa00" },
  { name: "orange", hexHtml: "#ff8b00", hex: "ff8b00" },
  { name: "olive", hexHtml: "#82b539", hex: "82b539" },
];

export const checkCollision = (
  objA: DisplayObject,
  objB: DisplayObject
): boolean => {
  const a = objA.getBounds();
  const b = objB.getBounds();

  const rightmostLeft = a.left < b.left ? b.left : a.left;
  const leftmostRight = a.right > b.right ? b.right : a.right;

  if (leftmostRight <= rightmostLeft) return false;

  const bottommostTop = a.top < b.top ? b.top : a.top;
  const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;

  return topmostBottom > bottommostTop;
};

export const setSound = (soundAsset: string): object => {
  return Sound.from(soundAsset);
};

export const writeText = (text: string): Text => {
  const styly: TextStyle = new TextStyle({
    align: "center",
    fill: "#754c24",
    fontSize: 42,
  });

  const texty: Text = new Text(text, styly);

  return texty;
};

export const getRandomCircles = (n: number = 3): Array<ballColorDef> => {
  // Shuffle array
  const shuffled = circlesColors.sort(() => 0.5 - Math.random());

  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, n);
  return selected;
};

export const fillTubes = (tubesConfig: tubesConfigDef): filledTubesDef => {
  const { tubeStack, circleColors } = tubesConfig;
  const tubesArray = [];

  for (let i = 0; i < circleColors.length; i++) {
    let tubesColors = [];
    for (let j = 0; j < tubeStack; j++) tubesColors.push(circleColors[i]);
    tubesArray.push(tubesColors);
  }

  const totalMoves = shuffleMultiArray(tubesArray);

  // always adding two empty tubes
  tubesArray.push([]);
  tubesArray.push([]);

  return { totalMoves: totalMoves, tubesArray: tubesArray };
};

export const shuffleMultiArray = (multArr: any): number => {
  for (let i = 0; i < multArr.length; i++) {
    for (let j = 0; j < multArr[i].length; j++) {
      let floorMultArri = Math.floor(Math.random() * multArr.length);
      let floorMultArrj = Math.floor(Math.random() * multArr[i].length);

      let i1 = floorMultArri;
      let j1 = floorMultArrj;

      if (multArr[i][j].name !== multArr[i1][j1].name) {
        let temp = multArr[i][j];
        multArr[i][j] = multArr[i1][j1];
        multArr[i1][j1] = temp;
      }
    }
  }

  return gameSolver(cloneDeep(multArr));
};

export const calculateSize = (
  origWidth: number,
  origHeight: number,
  newWidth: number,
  newHeight: number = 0,
  roundto: number = 0
): resizeDef => {
  const ratio: number = origWidth / origHeight;

  const resizeResult: resizeDef = {
    newWidth: newWidth,
    newHeight: newHeight,
    ratio: ratio
  };

  if (newWidth !== 0) {
    resizeResult.newHeight =
      roundto > 0
        ? parseFloat((newWidth / ratio).toFixed(roundto))
        : Math.round(newWidth / ratio);
  }

  if (newHeight !== 0) {
    //newWidth = ratio * newHeight;
    resizeResult.newWidth =
      roundto > 0
        ? parseFloat(((ratio * newHeight) / ratio).toFixed(roundto))
        : Math.round(ratio * newHeight);
  }

  return resizeResult;
};
