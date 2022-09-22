import { Graphics, InteractionEvent, Text, TextStyle } from "pixi.js";
import { Manager } from "../Manager";
import { LocalStorage } from "ts-localstorage";
import MainScene from "../scenes/MainScene";

export default class LevelItem extends Graphics {
  private levelTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 30,
    fontWeight: "bolder",
    stroke: "black",
    strokeThickness: 4,
  });

  private levelText: Text = new Text("");

  constructor(
    lvlNumber: number,
    width: number = 80,
    heigth: number = 40,
    color: number = 0xfff200
  ) {
    super();
    this.lineStyle(2, 0xffffff, 1);
    this.beginFill(color, 1);
    this.drawRoundedRect(0, 0, width, heigth, 5);
    this.endFill();

    this.levelText.text = lvlNumber.toString();
    this.levelText.anchor.set(0.5, 0);
    this.levelText.x = this.width / 2;
    this.levelText.style = this.levelTextStyle;
    this.addChild(this.levelText);

    this.interactive = true;
    this.on("pointertap", this.itemClicked, this);
  }

  resize(_width: number, _height: number): void {}

  itemClicked(_e: InteractionEvent): void {
    LocalStorage.setItem(Manager.gameSettings, {
      ...Manager.loadedConfig,
      currentLevel: parseInt(this.levelText.text),
    });

    Manager.destroyApp();
    Manager.changeScene(new MainScene());
  }
}
