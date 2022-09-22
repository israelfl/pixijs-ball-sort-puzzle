import { sound } from "@pixi/sound";
import { LocalStorage } from "ts-localstorage";
import {
  Container,
  Graphics,
  InteractionEvent,
  Sprite,
  Texture,
} from "pixi.js";
import { IScene, Manager } from "../Manager";
import ButtonAction from "../components/ButtonAction";
import LevelScene from "./LevelScene";

export default class MenuScene extends Container implements IScene {
  private bg: Sprite = new Sprite(Texture.WHITE);
  private menuFrame: Graphics = new Graphics();
  private closeBtn: Sprite = Sprite.from("button-close");

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
    this.drawMenuFrame();
    this.drawCloseBtn();
    this.drawLevelBtn();
    this.drawShopBtn();
    this.drawVolumeBtn();
    this.drawLanguageBtn();
  }

  drawBg(): void {
    this.bg.width = Manager.width;
    this.bg.height = Manager.height;
    this.bg.alpha = 0.9;
    this.bg.tint = 0x111111;
    this.bg.interactive = true;
    this.addChild(this.bg);
  }

  drawMenuFrame(): void {
    const menuFrameParams = {
      width: 300,
      height: Manager.height * 0.8,
    };
    this.menuFrame.beginFill(0x333333);
    this.menuFrame.lineStyle(4, 0x666666);
    this.menuFrame.drawRoundedRect(
      Manager.width / 2 - menuFrameParams.width / 2,
      Manager.height / 2 - menuFrameParams.height / 2,
      menuFrameParams.width,
      menuFrameParams.height,
      20
    );
    this.menuFrame.endFill();
    this.addChild(this.menuFrame);
  }

  drawCloseBtn(): void {
    this.closeBtn.scale.x = this.closeBtn.scale.y = 0.3;
    this.closeBtn.x =
      this.menuFrame.getBounds().right - this.closeBtn.width / 2;
    this.closeBtn.y = this.menuFrame.getBounds().top - this.closeBtn.height / 2;
    this.closeBtn.interactive = true;
    this.closeBtn.on("pointertap", this.closeMenu, this);
    this.addChild(this.closeBtn);
  }

  drawLevelBtn(): void {
    const btnShop = new ButtonAction({
      menuFrame: this.menuFrame,
      assetIcon: "button-level",
      buttonText: "Level",
      toggleIcon: "button-level",
      action: (_e: InteractionEvent) => {
        Manager.changeScene(new LevelScene());
      },
    });

    btnShop.x = this.menuFrame.getBounds().left;
    btnShop.y = this.menuFrame.getBounds().top;

    this.addChild(btnShop);
  }

  drawShopBtn(): void {
    const btnShop = new ButtonAction({
      menuFrame: this.menuFrame,
      assetIcon: "button-shop",
      buttonText: "Shop",
      toggleIcon: "button-shop",
      action: (_e: InteractionEvent) => {
        console.log("Shop");
        //Manager.changeScene()
      },
    });

    btnShop.x = this.menuFrame.getBounds().left;
    btnShop.y = this.menuFrame.getBounds().top + 90;

    this.addChild(btnShop);
  }

  drawVolumeBtn(): void {
    const btnSound = new ButtonAction({
      menuFrame: this.menuFrame,
      assetIcon: "button-sound-on",
      buttonText: "Sound",
      toggleIcon: "button-sound-off",
      action: (_e: InteractionEvent, obj: any) => {
        const muteSoundResult = sound.toggleMuteAll();
        LocalStorage.setItem(Manager.gameSettings, {
          ...Manager.loadedConfig,
          sound: !muteSoundResult,
        });
        Manager.loadedConfig.sound = !muteSoundResult;
        obj.btnIcon.visible = !muteSoundResult;
        obj.btnToggleIcon.visible = muteSoundResult;
      },
    });

    btnSound.x = this.menuFrame.getBounds().left;
    btnSound.y = this.menuFrame.getBounds().top + 180;
    btnSound.btnIcon.visible = Manager.loadedConfig.sound || true;
    btnSound.btnToggleIcon.visible = !Manager.loadedConfig.sound || false;

    this.addChild(btnSound);
  }

  drawLanguageBtn(): void {
    const btnLanguage = new ButtonAction({
      menuFrame: this.menuFrame,
      assetIcon: "button-language",
      buttonText: "Language",
      toggleIcon: "button-language",
      action: (_e: InteractionEvent) => {
        console.log("Language");
        //Manager.changeScene()
      },
    });

    btnLanguage.x = this.menuFrame.getBounds().left;
    btnLanguage.y = this.menuFrame.getBounds().top + 270;

    this.addChild(btnLanguage);
  }

  closeMenu(_e: InteractionEvent): void {
    this.destroy()
  }
}
