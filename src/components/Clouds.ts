import { Texture, TilingSprite } from "pixi.js";

export default class Clouds extends TilingSprite {
  constructor() {
    const texture = Texture.from("clouds");
    super(texture, 1, texture.height); //width 1 because we will call onResize from App anyway
  }

  onResize(width: number, _height: number): void {
    this.width = width;
  }

  onUpdate(delta: number): void {
    this.tilePosition.x -= delta * 0.2;
  }
}
