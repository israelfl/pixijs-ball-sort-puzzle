import { Application, DisplayObject } from "pixi.js";
import { sound } from "@pixi/sound";
import { LocalStorage, LocalKey } from "ts-localstorage";
import { tubesConfigDef, filledTubesDef } from "./recipes/Utils";

interface BackgroundSettings {
  name: string;
  mode: string;
  bgcolor?: number;
}

interface LevelSettings {
  tubesConfig: tubesConfigDef;
  tubes: filledTubesDef;
}

interface GameConfig {
  background: BackgroundSettings;
  sound: boolean;
  currentLevel: number;
  levels: LevelSettings[]
}

export class Manager {
  private constructor() {
    /* this class is purely static. No constructor to see here */
  }

  // Safely store variables for our game
  private static app: Application;
  private static currentScene: IScene;
  public static defaultConfig: GameConfig = {
    background: { name: "bg-night", mode: "topcolor", bgcolor: 0x2e0f31 },
    sound: true,
    currentLevel: 1,
    levels: []
  };
  public static loadedConfig: GameConfig = Manager.defaultConfig;

  public static gameSettings: LocalKey<GameConfig> = new LocalKey(
    "config",
    Manager.defaultConfig
  );

  // With getters but no setters, these variables become read-only
  public static get width(): number {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }
  public static get height(): number {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }

  // Use this function ONCE to start the entire machinery
  public static initialize(background: number): void {
    const gameSettings = LocalStorage.getItem(Manager.gameSettings);
    if (!gameSettings) {
      LocalStorage.setItem(Manager.gameSettings, Manager.defaultConfig);
    } else {
      Manager.loadedConfig = gameSettings;
    }

    if (!Manager.loadedConfig.sound) sound.muteAll();

    // Create our pixi app
    Manager.app = new Application({
      view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
      resizeTo: window, // This line here handles th actual rezize!
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: background,
      backgroundAlpha: 0,
      antialias: true,
      //transparent: true,
    });

    // Add the ticker
    Manager.app.ticker.add(Manager.update);

    // listen for the browser telling us that the screen size changed
    window.addEventListener("resize", Manager.resize);

    // call it manually once so we are sure we are the correct size after starting
    Manager.resize();
  }

  public static resize(): void {
    // if we have a scene, we let it know that a resize changed
    if (Manager.currentScene) {
      Manager.currentScene.resize(Manager.width, Manager.height);
    }
  }

  // Call this function when you want to go a new scene
  public static changeScene(
    newScene: IScene,
    removeChild: boolean = true
  ): void {
    // Remove and destroy old scene... if we had one..
    if (Manager.currentScene && removeChild) {
      Manager.app.stage.removeChild(Manager.currentScene);
      Manager.currentScene.destroy();
    }

    // Add the new one
    Manager.currentScene = newScene;
    Manager.app.stage.addChild(Manager.currentScene);
  }

  // Call this function when you want reset entire game.
  public static destroyApp(): void {
    Manager.app.destroy();
    Manager.initialize(0xffffff);
  }

  // This update will be called by pixi ticker and tell th scene that a tick happened
  private static update(framesPassed: number): void {
    // Let the current scene know that we update it...
    // Just for funzies, sanity check that it exists first.
    if (Manager.currentScene) {
      Manager.currentScene.update(framesPassed);
    }

    // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
  }
}

export interface IScene extends DisplayObject {
  update(framesPassed: number): void;

  // we added the resize method to the interface
  resize(width: number, height: number): void;
}
