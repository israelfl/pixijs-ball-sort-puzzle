import { Container, InteractionEvent, Text, TextStyle } from "pixi.js";
import { IScene, Manager } from "../../Manager";
import MenuScene from "../../scenes/MenuScene";

export default class TubeSelector extends Container implements IScene {
  private levelTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 40,
    fontWeight: "bolder",
    stroke: "black",
    strokeThickness: 4,
  });

  private levelText: Text = new Text("Tube");

  constructor() {
    super();

    this.levelText.anchor.set(0.5, 0);
    this.levelText.x = Manager.width / 2;
    this.levelText.style = this.levelTextStyle;
    this.addChild(this.levelText);
  }

  update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  resize(width: number, _height: number): void {
    console.log("resize HeaerButtons");
    this.levelText.x = width / 2;
  }

  showMenu(_e: InteractionEvent): void {
    Manager.changeScene(new MenuScene(), false);
  }
}
