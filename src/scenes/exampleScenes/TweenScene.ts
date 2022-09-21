import { Tween, Group } from "tweedle.js";
import { Container, InteractionEvent, Sprite, Text, Ticker } from "pixi.js";
import { IScene, Manager } from "../../Manager";
import { writeText } from "../../recipes/Utils";
import { Scene } from "./Scene";

export class TweenScene extends Container implements IScene {
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

    Ticker.shared.add(this.update, this);

    // See how these chains all together
    new Tween(this.clampy.scale)
      .to({ x: 0.5, y: 0.5 }, 1000)
      .repeat(Infinity)
      .yoyo(true)
      .start();

    // This is the same code, but unchained
    // const tweeny = new Tween(this.clampy.scale)
    // tweeny.to({x: 0.5, y:0.5}, 1000)
    // tweeny.repeat(Infinity)
    // tweeny.yoyo(true)
    // tweeny.start()

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

  public update(_framesPassed: number): void {
    // You need to update a group for the tweens to do something!
    Group.shared.update();
  }

  public resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
  }

  private onClicky(e: InteractionEvent): void {
    console.log("You interacted with Clampy!");
    console.log("The data of your interaction is super insteresting: ", e);

    Manager.changeScene(new Scene());

    // Global position of the interaction
    // e.data.global;

    // Local (inside clampy) position of the interaction
    // e.data.getLocalPosition(this.clampy);
    // Remember Clampy has the 0,0 in its center because we set the anchor to 0.5!
  }
}
