import { Graphics, InteractionEvent, Text, TextStyle } from "pixi.js";
import { Manager } from "../Manager";
import { LocalStorage } from "ts-localstorage";
import MainScene from "../scenes/MainScene";
import { backgroundAssetDef } from "../assets/background-assets";
import Background from "./Background";

export default class BackgroundItem extends Graphics {
  private titleTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 30,
    fontWeight: "bolder",
    stroke: "black",
    strokeThickness: 4,
  });

  private title: Text = new Text("");

  private assetJson: backgroundAssetDef;

  private backgroundContainer: Background = new Background();

  constructor(
    text: string,
    assetJson: backgroundAssetDef,
    width: number = 280,
    heigth: number = 130,
    color: number = 0x0
  ) {
    super();

    this.assetJson = assetJson;

    this.lineStyle(2, 0xcccccc, 1);
    this.beginFill(
      this.assetJson.name === Manager.loadedConfig.background.name
        ? 0x49b728
        : color,
      1
    );
    this.drawRoundedRect(0, 0, width, heigth, 5);
    this.endFill();

    this.backgroundContainer = new Background(
      assetJson,
      this.width,
      this.height
    );
    this.backgroundContainer.scale.x = this.backgroundContainer.scale.y = 0.94
    this.backgroundContainer.x =
      this.width / 2 - this.backgroundContainer.width / 2;
    this.backgroundContainer.y =
      this.height / 2 - this.backgroundContainer.height / 2;
    this.addChild(this.backgroundContainer);

    this.title.text = text;
    this.title.anchor.set(0.5, 0.5);
    this.title.x = this.width / 2;
    this.title.y = this.height - this.title.height;
    this.title.style = this.titleTextStyle;
    this.addChild(this.title);

    this.interactive = true;
    this.on("pointertap", this.itemClicked, this);
  }

  resize(_width: number, _height: number): void {}

  itemClicked(_e: InteractionEvent): void {
    LocalStorage.setItem(Manager.gameSettings, {
      ...Manager.loadedConfig,
      background: this.assetJson,
    });

    Manager.destroyApp();
    Manager.changeScene(new MainScene());
  }
}
