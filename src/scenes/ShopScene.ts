import { Container, InteractionEvent } from "pixi.js";
import { IScene } from "../Manager";

export default class ShopScene extends Container implements IScene {
  constructor() {
    super();

    this.drawScene();
  }

  update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
  }

  drawScene(): void {}

  closeMenu(_e: InteractionEvent): void {
    this.visible = !this.visible;
  }
}
