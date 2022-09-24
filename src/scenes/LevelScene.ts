import {
  Container,
  InteractionEvent,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { IScene, Manager } from "../Manager";
import LevelItem from "../components/LevelItem";

export default class LevelScene extends Container implements IScene {
  private lvlTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 40,
    fontWeight: "bolder",
    stroke: "black",
    strokeThickness: 4,
  });
  private bg: Sprite = new Sprite(Texture.WHITE);
  private topBg: Sprite = new Sprite(Texture.WHITE);
  private backBtn: Sprite = Sprite.from("button-back");
  private downBtn: Sprite = Sprite.from("button-down");
  private upBtn: Sprite = Sprite.from("button-up");
  private lvlFrame: Container = new Container();
  private topFrame: Container = new Container();
  private lvlMoving: boolean = false;
  private lvlText: Text = new Text("LEVEL");

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

  drawScene(): void {
    this.drawBg();
    this.drawTopBg();
    this.drawBackBtn();
    this.drawLvlText();
    this.drawDownBtn();
    this.drawUpBtn();
    this.drawLevelBtns();
    this.drawLevelFrame();
    this.drawTopFrame();
  }

  drawBg(): void {
    this.bg.width = Manager.width;
    this.bg.height = Manager.height;
    this.bg.alpha = 1;
    this.bg.tint = 0x000000;
    this.bg.interactive = true;
    this.addChild(this.bg);
  }

  drawTopBg(): void {
    this.topBg.width = Manager.width;
    this.topBg.height = 90;
    this.topBg.alpha = 1;
    this.topBg.tint = 0x222222;
    this.topFrame.addChild(this.topBg);
  }

  drawBackBtn(): void {
    this.backBtn.scale.x = this.backBtn.scale.y = 0.5;
    this.backBtn.y = this.topBg.height / 2 - this.backBtn.height / 2;
    this.backBtn.interactive = true;
    this.backBtn.on("pointertap", this.backToMenu, this);
    this.topFrame.addChild(this.backBtn);
  }

  drawLvlText(): void {
    this.lvlText.style = this.lvlTextStyle;
    this.lvlText.y = this.topBg.height / 2 - this.lvlText.height / 2;
    this.lvlText.x = this.topBg.width / 2 - this.lvlText.width / 2;
    this.topFrame.addChild(this.lvlText);
  }

  drawDownBtn(): void {
    this.downBtn.scale.x = this.downBtn.scale.y = 0.5;
    this.downBtn.x = Manager.width - (this.downBtn.width * 2);
    this.downBtn.y = this.topBg.height / 2 - this.downBtn.height / 2;
    this.downBtn.interactive = true;
    this.downBtn.on("pointertap", this.pageDown, this);
    this.topFrame.addChild(this.downBtn);
  }

  drawUpBtn(): void {
    this.upBtn.scale.x = this.upBtn.scale.y = 0.5;
    this.upBtn.x = Manager.width - (this.downBtn.width);
    this.upBtn.y = this.topBg.height / 2 - this.upBtn.height / 2;
    this.upBtn.interactive = true;
    this.upBtn.on("pointertap", this.pageUp, this);
    this.topFrame.addChild(this.upBtn);
  }

  drawLevelBtns(): void {
    const fitItems = Math.floor(Manager.width / 100);
    for (let i = 0; i <= Manager.loadedConfig.levels.length - 1; i++) {
      const lvlBtn = new LevelItem(i + 1);
      lvlBtn.x = Math.floor(i % fitItems) * 100;
      lvlBtn.y = Math.floor(i / fitItems) * 60;
      this.lvlFrame.addChild(lvlBtn);
    }
  }

  drawLevelFrame(): void {
    const offset = 110;
    this.lvlFrame.x = Manager.width / 2 - this.lvlFrame.width / 2;
    this.lvlFrame.y = offset;

    this.addChild(this.lvlFrame);
  }

  drawTopFrame(): void {
    this.topFrame.height = 90;
    this.addChild(this.topFrame);
  }

  backToMenu(_e: InteractionEvent): void {
    this.destroy();
  }

  pageDown(): void {
    if (Manager.height > this.lvlFrame.getBounds().bottom || this.lvlMoving)
      return;

    this.lvlMoving = true;

    new Tween(this.lvlFrame)
      .to(
        //{ y: this.lvlFrame.y - (this.lvlFrame.height + this.topFrame.height) },
        { y: this.lvlFrame.y - (Manager.height - 90) },
        1000
      )
      .easing(Easing.Exponential.Out)
      .onComplete(() => {
        this.lvlMoving = false;
      })
      .start();
  }

  pageUp(): void {
    if (!(this.lvlFrame.y < 110) || this.lvlMoving) return;

    this.lvlMoving = true;

    new Tween(this.lvlFrame)
      .to(
        //{ y: this.lvlFrame.y + this.lvlFrame.height + 110 }
        { y: this.lvlFrame.y + (Manager.height - 90) },
        1000
      )
      .easing(Easing.Exponential.Out)
      .onComplete(() => {
        this.lvlMoving = false;
      })
      .start();
  }
}
