import { Container, InteractionEvent, Sprite, Ticker, Text } from "pixi.js";
import { IScene, Manager } from "../../Manager";
import { writeText } from "../../recipes/Utils";
import { TweenScene } from "./TweenScene";

export class TickerScene extends Container implements IScene {
  // We promote clampy to a member of the class
  private clampy: Sprite;
  private clampyVelocity: number = 5;
  private texty: Text;
  constructor() {
    super(); // Mandatory! This calls the superclass contructor.

    // Inside assets.ts we have a line that says `{ name: "Clampy from assets.ts!", url: "./clampy.png" }`
    this.clampy = Sprite.from("Clampy from assets.ts!");

    this.clampy.anchor.set(0.5);
    this.clampy.x = 0;
    this.clampy.y = Manager.height / 2;
    this.addChild(this.clampy);

    // See the `, this` thingy there? That is another way of binding the context!
    Ticker.shared.add(this.update, this);

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

  public update(framesPassed: number): void {
    this.clampy.x = this.clampy.x + this.clampyVelocity * framesPassed;

    if (this.clampy.x > Manager.width) {
      // Woah there clampy, come back inside the screen!
      this.clampy.x = 0;
    }
  }

  public resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
  }

  private onClicky(e: InteractionEvent): void {
    console.log("You interacted with Clampy!");
    console.log("The data of your interaction is super insteresting: ", e);

    Manager.changeScene(new TweenScene());

    // Global position of the interaction
    // e.data.global;

    // Local (inside clampy) position of the interaction
    // e.data.getLocalPosition(this.clampy);
    // Remember Clampy has the 0,0 in its center because we set the anchor to 0.5!
  }
}
