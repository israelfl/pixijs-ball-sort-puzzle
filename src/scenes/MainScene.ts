import { Container } from "pixi.js";
import { Sound } from "@pixi/sound";
import { LocalStorage } from "ts-localstorage";
import { IScene, Manager } from "../Manager";
import {
  filledTubesDef,
  fillTubes,
  getRandomCircles,
  getRndInteger,
  tubesConfigDef,
} from "../recipes/Utils";
import FinishScene from "./FinishScene";
import Background from "../components/Background";
import TestTube from "../components/TestTube";
import HeaderButtons from "../components/HeaderButtons";
type tubeStatusDef = {
  inUse: number;
  tubeIndex: number;
};

export default class MainScene extends Container implements IScene {
  private background: Background;
  private headerButtons: HeaderButtons;
  private tubeDisplay: Container = new Container();
  public static stack: tubesConfigDef;
  public static testTubes: TestTube[] = [];
  public static filledTubes: filledTubesDef;
  public static fxClick: Sound;
  public static fxCompleted: Sound;
  public static tubeStatus: tubeStatusDef = {
    inUse: 0,
    tubeIndex: -1,
  };

  constructor() {
    super();

    MainScene.testTubes = [];

    if (
      Manager.loadedConfig.levels.length &&
      Manager.loadedConfig.levels[Manager.loadedConfig.currentLevel - 1] !==
        undefined
    ) {
      MainScene.stack =
        Manager.loadedConfig.levels[
          Manager.loadedConfig.currentLevel - 1
        ].tubesConfig;
      MainScene.stack.moves = 0;

      MainScene.filledTubes =
        Manager.loadedConfig.levels[
          Manager.loadedConfig.currentLevel - 1
        ].tubes;
    } else {
      MainScene.stack = {
        tubeStack: getRndInteger(3, 5),
        circleColors: getRandomCircles(getRndInteger(8, 12)),
        moves: 0,
      };

      MainScene.filledTubes = fillTubes(MainScene.stack);

      Manager.loadedConfig.levels.push({
        tubesConfig: MainScene.stack,
        tubes: MainScene.filledTubes,
      });

      LocalStorage.setItem(Manager.gameSettings, {
        ...Manager.loadedConfig,
        levels: Manager.loadedConfig.levels,
      });
    }

    this.background = new Background();
    this.addChild(this.background);

    this.headerButtons = new HeaderButtons({
      resetAction: this.resetScene,
      mainScene: this,
    });
    this.addChild(this.headerButtons);

    MainScene.fxClick = Sound.from({
      url: "./click.mp3",
      preload: true,
    });

    MainScene.fxCompleted = Sound.from({
      url: "./tube-completed.mp3",
      preload: true,
    });

    this.drawTubes();
  }

  resetScene(): void {
    console.log("resetScene", this);
    MainScene.testTubes = [];
    MainScene.stack.moves = 0;
    this.tubeDisplay.destroy();
    this.tubeDisplay = new Container();
    this.drawTubes();
  }

  drawTubes(): void {
    MainScene.filledTubes.tubesArray.forEach((v: any, k: number) => {
      let testTube = new TestTube(MainScene.stack.tubeStack, v, k);
      testTube.x = k * 100;
      if (k > MainScene.stack.circleColors.length / 2) {
        testTube.x = (k - MainScene.stack.circleColors.length / 2 - 1) * 100;
        testTube.y = 310;
      }
      testTube.scale.x = testTube.scale.y = 0.2;
      this.tubeDisplay.addChild(testTube);
      MainScene.testTubes.push(testTube);
    });

    this.tubeDisplay.x = Manager.width / 2 - this.tubeDisplay.width / 2;
    this.tubeDisplay.y = Manager.height / 2 - this.tubeDisplay.height / 2 + 40;
    this.addChild(this.tubeDisplay);
  }

  static checkTubes(): boolean {
    console.log({
      "MainScene.stack.moves": MainScene.stack.moves,
      "MainScene.filledTubes.totalMoves": MainScene.filledTubes.totalMoves,
    });

    // tiene que haber 2 tubos vacios
    const emptyTubes = MainScene.testTubes.filter((value) => {
      return value.children.length === 1;
    }).length;

    if (emptyTubes !== 2) return false;

    const finishedTubes = MainScene.testTubes.filter((tubeValue) => {
      if (tubeValue.children.length === 1) return false;

      const onlyUnique = (value: any, index: number, self: any): boolean => {
        return self.indexOf(value) === index;
      };
      const ballColors = tubeValue.children.map((circleValue: any) => {
        return circleValue.myColor;
      });
      ballColors.shift();
      const uniques = ballColors.filter(onlyUnique);
      return uniques.length === 1;
    });

    console.log({
      emptyTubes: emptyTubes,
      "MainScene.stack.circleColors.length":
        MainScene.stack.circleColors.length,
      finishedTubes: finishedTubes,
    });

    if (finishedTubes.length === MainScene.stack.circleColors.length) {
      MainScene.fxCompleted.play();
      Manager.changeScene(
        new FinishScene(
          MainScene.stack.moves,
          MainScene.filledTubes.totalMoves
        ),
        false
      );
      return true;
    }

    return false;
  }

  update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  public resize(width: number, height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
    this.background.resize(width, height);
    this.headerButtons.resize(width, height);

    this.tubeDisplay.x = width / 2 - this.tubeDisplay.width / 2;
    this.tubeDisplay.y = height / 2 - this.tubeDisplay.height / 2;
  }
}
