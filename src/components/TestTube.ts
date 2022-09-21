import {
  Container,
  InteractionEvent,
  Rectangle,
  Sprite,
  Texture,
  Ticker,
} from "pixi.js";
import { Tween, Group, Easing } from "tweedle.js";
import { IScene } from "../Manager";
import Circle from "../components/Circle";
import { ballColorDef } from "../recipes/Utils";
import MainScene from "../scenes/MainScene";
import { GlowFilter } from "pixi-filters";

export default class TestTube extends Container implements IScene {
  private tubeTexture: Texture;
  private stack: number;
  private tubeIndex: number = 0;
  private ballRadius: number = 100;
  private topRectangle: Rectangle;

  constructor(
    stack: number = 5,
    ballColors: ballColorDef[],
    tubeIndex: number = 0
  ) {
    super();

    this.stack = stack;
    this.tubeIndex = tubeIndex;
    this.tubeTexture = Texture.from("test-tube");

    const tubeContainer: Container = new Container();

    this.topRectangle = new Rectangle(0, 0, this.tubeTexture.width, 110);
    this.tubeTexture.frame = this.topRectangle;
    const tubeTop = new Sprite(this.tubeTexture.clone());
    tubeContainer.addChild(tubeTop);

    const circleRectangleHeight = this.ballRadius * 2;

    const circleRectangle = new Rectangle(
      0,
      this.topRectangle.bottom,
      this.tubeTexture.width,
      circleRectangleHeight
    );

    for (let index = 0; index < this.stack; index++) {
      this.tubeTexture.frame = circleRectangle;
      let tubeCircle = new Sprite(this.tubeTexture.clone());
      tubeCircle.x = 0;
      tubeCircle.y = this.topRectangle.bottom + index * this.ballRadius * 2;
      tubeContainer.addChild(tubeCircle);
    }

    const bottomRectangle = new Rectangle(0, 950, this.tubeTexture.width, 160);
    this.tubeTexture.frame = bottomRectangle;
    const tubeBottom = new Sprite(this.tubeTexture.clone());
    tubeBottom.x = 0;
    tubeBottom.y =
      circleRectangle.height * this.stack + this.topRectangle.bottom;
    tubeContainer.addChild(tubeBottom);

    // Super important or the object will never receive mouse events!
    tubeContainer.interactive = true;
    tubeContainer.on("pointertap", this.onClicky, this);
    this.addChild(tubeContainer);

    ballColors.forEach((v, k) => {
      let tempCircle = new Circle(parseInt("0x" + v.hex, 16), this.ballRadius);
      tempCircle.x = tubeContainer.width / 2;
      //let tempcircleY = this.getBounds().bottom - (k + 1) * tempCircle.height;
      tempCircle.y = tempCircle.height * (k + 1) + 110;
      this.addChild(tempCircle);
    });

    Ticker.shared.add(this.update, this);
  }

  update(_framesPassed: number): void {
    Group.shared.update();
  }

  resize(_width: number, _height: number): void {
    this.x = this.width / 2;
    this.y = this.height / 2;
  }

  onClicky(_e: InteractionEvent): void {
    if (
      this.checkTubeInUse() &&
      this.checkSameTube() &&
      this.checkDestTubeFull() &&
      this.checkDestTubeNotFull()
    ) {
      MainScene.stack.moves++;
      if (!MainScene.checkTubes()) {
        if (this.children.length > 1 && this.checkSelfBalls()) {
          this.filters = [
            new GlowFilter({ distance: 15, outerStrength: 5, color: 0x5cfa00 }),
          ];
          new Tween(this.filters[0])
            .to(
              {
                distance: 0,
                outerStrength: 0,
              },
              3000
            )
            .easing(Easing.Exponential.Out)
            .onStart((_obj, _tween): void => {
              MainScene.fxCompleted.play();
            })
            .onComplete((_obj, _tween): void => {})
            .start();
        }
      }
    }
  }

  checkTubeInUse(): boolean {
    if (!MainScene.tubeStatus.inUse) {
      // no se esta usando ningun tubo
      if (this.children.length > 1) {
        MainScene.fxClick.play();
        // subo bola pq el tubo tiene bolas

        MainScene.tubeStatus.inUse = 1;
        MainScene.tubeStatus.tubeIndex = this.tubeIndex;

        this.makeTweenY(
          this.getChildAt(1),
          this.getLocalBounds().y - this.ballRadius - 20
        );

        return false;
      }
    }
    return true;
  }

  checkSameTube(): boolean {
    if (MainScene.tubeStatus.tubeIndex === this.tubeIndex) {
      // bajo bola pq esta subida y es mismo tubo
      MainScene.fxClick.play();

      MainScene.tubeStatus.inUse = 0;
      MainScene.tubeStatus.tubeIndex = -1;

      this.makeTweenY(
        this.getChildAt(1),
        this.getChildAt(1).y +
          (this.getChildAt(0).getLocalBounds().y +
            (this.stack + 1 - (this.children.length - 1)) *
              this.getChildAt(1).getLocalBounds().height +
            230)
      );

      return false;
    }

    return true;
  }

  checkDestTubeFull(): boolean {
    if (
      MainScene.tubeStatus.tubeIndex !== this.tubeIndex &&
      this.children.length - 1 === this.stack
    ) {
      // el tubo es distinto y esta lleno de bolas

      this.swapCircles();
      return false;
    }

    return true;
  }

  checkDestTubeNotFull(): boolean {
    if (
      MainScene.tubeStatus.inUse &&
      MainScene.tubeStatus.tubeIndex !== this.tubeIndex &&
      this.children.length - 1 < this.stack
    ) {
      // el tubo es distinto y NO esta lleno de bolas

      if (MainScene.testTubes[this.tubeIndex].children.length > 1) {
        // el tubo destino tiene bolas
        let destColor: any = MainScene.testTubes[this.tubeIndex].children[1];
        let currentColor: any =
          MainScene.testTubes[MainScene.tubeStatus.tubeIndex].children[1];
        if (destColor.myColor !== currentColor.myColor) {
          // los colores no son iguales
          this.swapCircles();
          return false;
        }
      }

      MainScene.testTubes[this.tubeIndex].addChildAt(
        MainScene.testTubes[MainScene.tubeStatus.tubeIndex].children[1],
        1
      );

      MainScene.tubeStatus.inUse = 0;
      MainScene.tubeStatus.tubeIndex = -1;

      this.makeTweenY(
        this.getChildAt(1),
        this.getLocalBounds().bottom -
          160 -
          this.ballRadius * 2 * (this.children.length - 2)
      );

      MainScene.fxClick.play();

      return true;
    }

    return false;
  }

  swapCircles(): void {
    MainScene.fxClick.play();

    const originTube = MainScene.testTubes[MainScene.tubeStatus.tubeIndex];

    this.makeTweenY(
      originTube.children[1],
      originTube.getLocalBounds().bottom -
        160 -
        this.ballRadius * 2 * (originTube.children.length - 2)
    );

    MainScene.tubeStatus.inUse = 1;
    MainScene.tubeStatus.tubeIndex = this.tubeIndex;

    this.makeTweenY(
      this.getChildAt(1),
      this.getChildAt(1).y -
        (this.getChildAt(0).getLocalBounds().y +
          (this.stack + 1 - (this.children.length - 1)) *
            this.getChildAt(1).getLocalBounds().height +
          230)
    );
  }

  checkSelfBalls(): boolean {
    if (this.children.length < MainScene.stack.tubeStack + 1) return false;

    const onlyUnique = (value: any, index: number, self: any): boolean => {
      return self.indexOf(value) === index;
    };

    const ballColors = this.children.map((circleValue: any) => {
      return circleValue.myColor;
    });
    ballColors.shift();
    const uniques = ballColors.filter(onlyUnique);
    return uniques.length === 1;
  }

  makeTweenY(obj: any, y: number): void {
    new Tween(obj).to({ y: y }, 300).easing(Easing.Exponential.Out).start();
  }

  makeTweenX(obj: any, x: number): void {
    new Tween(obj).to({ x: x }, 1000).easing(Easing.Exponential.Out).start();
  }
}
