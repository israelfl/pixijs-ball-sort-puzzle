import { Container, InteractionEvent, Sprite, Text } from "pixi.js";
import { IScene, Manager } from "../../Manager";
import { writeText } from "../../recipes/Utils";
import { GameScene } from "./GameScene";

export class Scene extends Container implements IScene {
  // We promote clampy to a member of the class
  private clampy: Sprite;
  private texty: Text;

  constructor() {
    super(); // Mandatory! This calls the superclass contructor.

    // Now clampy is a class member, we will need be able to use it in another methods!
    // Inside assets.ts we have a line that says `{ name: "Clampy from assets.ts!", url: "./clampy.png" }`
    this.clampy = Sprite.from("Clampy from assets.ts!");

    this.clampy.anchor.set(0.5);
    this.clampy.x = Manager.width / 2;
    this.clampy.y = Manager.height / 2;
    this.addChild(this.clampy);
    // events that begin with "pointer" are touch + mouse
    this.clampy.on("pointertap", this.onClicky, this);
    // Super important or the object will never receive mouse events!
    this.clampy.interactive = true;

    this.texty = writeText(this.constructor.name);
    this.texty.x = Manager.width / 2;
    this.texty.y += this.texty.height / 2;
    this.texty.anchor.set(0.5);
    this.addChild(this.texty);
  }

  public update(_framesPassed: number): void {}

  public resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
  }

  private onClicky(e: InteractionEvent): void {
    console.log("You interacted with Clampy!");
    console.log("The data of your interaction is super insteresting: ", e);

    Manager.changeScene(new GameScene());
  }
}
