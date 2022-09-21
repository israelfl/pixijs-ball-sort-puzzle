import { Container, Sprite, Text } from "pixi.js";
import { IScene, Manager } from "../../Manager";
import { writeText } from "../../recipes/Utils";

export class GameScene extends Container implements IScene {
  private clampy: Sprite;
  private clampyVelocity: number;
  private texty: Text;

  constructor() {
    super();

    // Inside assets.ts we have a line that says `{ name: "Clampy from assets.ts!", url: "./clampy.png" }`
    this.clampy = Sprite.from("Clampy from assets.ts!");

    this.clampy.anchor.set(0.5);
    this.clampy.x = Manager.width / 2;
    this.clampy.y = Manager.height / 2;
    this.addChild(this.clampy);

    this.clampyVelocity = 5;

    this.texty = writeText(this.constructor.name);
    this.texty.x = Manager.width / 2;
    this.texty.y += this.texty.height / 2;
    this.texty.anchor.set(0.5);
    this.addChild(this.texty);
  }

  public update(framesPassed: number): void {
    // Lets move clampy!
    this.clampy.x += this.clampyVelocity * framesPassed;

    if (this.clampy.x > Manager.width) {
      this.clampy.x = Manager.width;
      this.clampyVelocity = -this.clampyVelocity;
    }

    if (this.clampy.x < 0) {
      this.clampy.x = 0;
      this.clampyVelocity = -this.clampyVelocity;
    }
  }

  public resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
  }
}
