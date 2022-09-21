import {
  Container,
  Sprite,
  Texture,
  Text,
  TextStyle,
  InteractionEvent,
} from "pixi.js";
import { IScene, Manager } from "../Manager";
import { Easing, Tween } from "tweedle.js";
import MainScene from "./MainScene";
import { LocalStorage } from "ts-localstorage";

export default class FinishScene extends Container implements IScene {
  private finishTexts: Array<string> = [
    "Cool",
    "Bravo",
    "Perfect",
    "Nice",
    "Awesome",
  ];
  private finishBannerTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 72,
    fontWeight: "bolder",
  });

  private finishPercentTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 42,
    fontWeight: "bolder",
  });

  private percentCalc: number;

  private bg: Sprite = new Sprite(Texture.WHITE);
  private bannerBg: Sprite = new Sprite(Texture.WHITE);
  private bannerFront: Sprite = new Sprite(Texture.WHITE);
  private finishBannerText: Text = new Text(
    this.finishTexts[Math.floor(Math.random() * this.finishTexts.length)]
  );
  private finishPercentText: Text = new Text("0%");
  private buttonNext = Sprite.from("button-next");
  private backStar: Sprite = Sprite.from("back-star");
  private gift: Sprite = Sprite.from("gift");
  private giftMask: Sprite = new Sprite(Texture.WHITE);

  constructor(moves: number, totalMoves: number) {
    super();

    Manager.loadedConfig.levels.push({
      tubesConfig: MainScene.stack,
      tubes: MainScene.filledTubes,
    });

    LocalStorage.setItem(Manager.gameSettings, {
      ...Manager.loadedConfig,
      currentLevel: Manager.loadedConfig.levels.length -1,
      levels: Manager.loadedConfig.levels,
    });

    this.percentCalc =
      moves <= totalMoves || totalMoves === 0
        ? 100
        : Math.floor((totalMoves * 100) / moves);

    this.drawScene();
    this.startTweens();
  }

  update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
  }

  drawScene(): void {
    this.drawBg();
    this.drawBannerBg();
    this.drawBannerFront();
    this.drawFinishBannerText();
    this.drawFinishPercentText();
    this.drawButtonNext();
    this.drawBackStar();
    this.drawGift();
    this.drawGiftMask();
  }

  drawBg(): void {
    this.bg.width = Manager.width;
    this.bg.height = Manager.height;
    this.bg.alpha = 0.9;
    this.bg.tint = 0x111111;
    this.bg.interactive = true;
    this.addChild(this.bg);
  }

  drawBannerBg(): void {
    this.bannerBg.tint = 0xbb0000;
    this.bannerBg.anchor.set(0.5);
    this.bannerBg.width = Manager.width / 2;
    this.bannerBg.height = 100;
    this.bannerBg.alpha = 0.3;
    this.bannerBg.x = Manager.width / 2;
    this.bannerBg.y = this.bannerBg.height / 2 + 35;
    this.bannerBg.scale.x = 0;
    this.bannerBg.anchor.x / 2;
    this.addChild(this.bannerBg);
  }

  drawBannerFront(): void {
    this.bannerFront.tint = 0xdd0000;
    this.bannerFront.anchor.set(0.5);
    this.bannerFront.width = Manager.width;
    this.bannerFront.height = 100;
    this.bannerFront.x = Manager.width / 2;
    this.bannerFront.y = this.bannerFront.height / 2 + 35;
    this.bannerFront.skew.y = -0.035;
    this.bannerFront.scale.x = 0;
    this.addChild(this.bannerFront);
  }

  drawFinishBannerText(): void {
    this.finishBannerText.style = this.finishBannerTextStyle;
    this.finishBannerText.x =
      Manager.width / 2 - this.finishBannerText.width / 2;
    this.finishBannerText.y = Manager.height * 0.06;
    this.addChild(this.finishBannerText);
  }

  drawFinishPercentText(): void {
    this.finishPercentText.style = this.finishPercentTextStyle;
    this.finishPercentText.x =
      Manager.width / 2 - this.finishPercentText.width / 2;
    this.finishPercentText.y = Manager.height * 0.27;
    this.addChild(this.finishPercentText);
  }

  drawButtonNext(): void {
    this.buttonNext.scale.x = this.buttonNext.scale.y = 0.6;
    this.buttonNext.x = Manager.width / 2 - this.buttonNext.width / 2;
    this.buttonNext.y = Manager.height * 0.7;
    this.buttonNext.interactive = true;
    this.buttonNext.on("pointertap", this.btnNextClick, this);
    this.addChild(this.buttonNext);
  }

  drawBackStar(): void {
    this.backStar.anchor.set(0.5);
    this.backStar.scale.x = this.backStar.scale.y = 0.8;
    this.backStar.x = Manager.width / 2;
    this.backStar.y = Manager.height / 2;
    this.backStar.alpha = 0;
    this.addChild(this.backStar);
  }

  drawGift(): void {
    this.gift.anchor.set(0.5, 0);
    this.gift.scale.x = this.gift.scale.y = 0.2;
    this.gift.x = Manager.width / 2;
    this.gift.y = Manager.height / 2 - this.gift.height / 2;
    this.addChild(this.gift);
  }

  drawGiftMask(): void {
    this.giftMask.tint = 0xbb0000;
    this.giftMask.anchor.set(0.5);
    this.giftMask.width = this.gift.width;
    this.giftMask.height = this.gift.height;
    this.giftMask.alpha = 1;
    this.giftMask.x = this.gift.x;
    this.giftMask.y = this.gift.getBounds().bottom + this.gift.height / 2;
    this.addChild(this.giftMask);
    this.gift.mask = this.giftMask;
  }

  startTweens(): void {
    new Tween(this.backStar).to({ alpha: 1 }, 4000).start();

    new Tween(this.bannerBg.scale)
      .to({ x: 40 }, 1200)
      .easing(Easing.Quartic.Out)
      .start();

    new Tween(this.bannerFront.scale)
      .to({ x: 45 }, 1000)
      .easing(Easing.Sinusoidal.Out)
      .start();

    new Tween({ percent: 0 })
      .to({ percent: this.percentCalc }, 500)
      .onUpdate((obj, _repeat, _tweenRef) => {
        this.finishPercentText.text = Math.floor(obj.percent) + "%";
        this.finishPercentText.x =
          Manager.width / 2 - this.finishPercentText.width / 2;
      })
      .start();

    const maskTweenTo =
      this.gift.getGlobalPosition().y +
      this.gift.height / 2 +
      (this.gift.height * (100 - this.percentCalc)) / 100;

    new Tween(this.gift.mask).to({ y: maskTweenTo }, 500).start();
  }

  btnNextClick(_e: InteractionEvent): void {
    Manager.destroyApp();
    Manager.changeScene(new MainScene());
  }
}
