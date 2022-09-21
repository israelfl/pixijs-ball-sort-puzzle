import { Container, InteractionEvent, Sprite, Text } from "pixi.js";
import { IScene, Manager } from "../../Manager";
import { writeText } from "../../recipes/Utils";
import { TickerScene } from "./TickerScene";

export class PointerEventScene extends Container implements IScene {
  private clampy: Sprite;
  private texty: Text;

  constructor() {
    super();

    // Inside assets.ts we have a line that says `{ name: "Clampy from assets.ts!", url: "./clampy.png" }`
    this.clampy = Sprite.from("Clampy from assets.ts!");

    this.clampy.anchor.set(0.5);
    this.clampy.x = Manager.width / 2;
    this.clampy.y = Manager.height / 2;
    this.addChild(this.clampy);

    // events that begin with "pointer" are touch + mouse
    this.clampy.on("pointertap", this.onClicky, this);

    // This only work with a mouse
    //this.clampy.on("click", this.onClicky, this);

    // This only work with touch
    // this.clampy.on("tap", this.onClicky, this);

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

    Manager.changeScene(new TickerScene());

    // Global position of the interaction
    // e.data.global;

    // Local (inside clampy) position of the interaction
    // e.data.getLocalPosition(this.clampy);
    // Remember Clampy has the 0,0 in its center because we set the anchor to 0.5!
  }
}
