import { Container, Sprite, Text } from "pixi.js";
import { IScene, Manager } from "../../Manager";
import { writeText } from "../../recipes/Utils";
import { PointerEventScene } from "./PointerEventScene";
import Clouds from "../../components/Clouds";

export class KeyboardEventScene extends Container implements IScene {
  private clouds: Clouds;
  private clampy: Sprite;
  private texty: Text;

  getClassName() {
    return this.constructor.name;
  }
  constructor() {
    super();

    this.clouds = new Clouds();
    this.clouds.width = Manager.width;
    this.addChild(this.clouds);

    // Inside assets.ts we have a line that says `{ name: "Clampy from assets.ts!", url: "./clampy.png" }`
    this.clampy = Sprite.from("Clampy from assets.ts!");

    this.clampy.anchor.set(0.5);
    this.clampy.x = Manager.width / 2;
    this.clampy.y = Manager.height / 2;
    //this.clampy.scale.x = 0.5;
    //this.clampy.scale.y = 0.5;
    this.addChild(this.clampy);

    this.texty = writeText(this.constructor.name);
    this.texty.x = Manager.width / 2;
    this.texty.y += this.texty.height / 2;
    this.texty.anchor.set(0.5);
    this.addChild(this.texty);

    // No pixi here, All HTML DOM baby!
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  public update(_framesPassed: number): void {
    this.clouds.onUpdate(_framesPassed)
  }

  public resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
    //this.clouds.onResize(Manager.width, Manager.height);
  }

  private onKeyDown(e: KeyboardEvent): void {
    console.log("KeyDown event fired!: ", e);

    // Most likely, you will switch on this:
    // e.code // if you care about the physical location of the key
    // e.key // if you care about the character that the key represents
  }

  private onKeyUp(e: KeyboardEvent): void {
    console.log("KeyUp event fired!: ", e);

    Manager.changeScene(new PointerEventScene());

    // Most likely, you will switch on this:
    // e.code // if you care about the physical location of the key
    // e.key // if you care about the character that the key represents
  }
}
