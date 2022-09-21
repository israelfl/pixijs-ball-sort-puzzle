import { Graphics } from "pixi.js";

export default class Circle extends Graphics {
  public myColor: number;

  constructor(color: number, radius: number) {
    super();
    this.lineStyle(0);
    this.beginFill(color, 1);
    this.drawCircle(0, 0, radius);
    this.endFill();
    this.myColor = color;
  }

  resize(_width: number, _height: number): void {}
}
