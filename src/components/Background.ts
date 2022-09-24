import { Container, Sprite, Texture, TilingSprite } from "pixi.js";
import { backgroundAssetDef } from "../assets/background-assets";
import { IScene, Manager } from "../Manager";
import { calculateSize } from "../recipes/Utils";

export default class Background extends Container implements IScene {
  private tiledBg: TilingSprite;
  private colorBg: Sprite = new Sprite(Texture.WHITE);

  private backgroundConfig: backgroundAssetDef;

  private bgWidth: number;
  private bgHeight: number;

  constructor(
    backgroundConfig: backgroundAssetDef = Manager.loadedConfig.background,
    width: number = Manager.width,
    height: number = Manager.height
  ) {
    super();

    this.backgroundConfig = backgroundConfig;
    this.bgWidth = width;
    this.bgHeight = height;

    this.tiledBg = new TilingSprite(
      Texture.from(this.backgroundConfig.name),
      this.bgWidth,
      this.bgHeight
    );

    switch (this.backgroundConfig.mode) {
      case "tiled":
        this.drawTiledBg();
        break;
      case "topcolor":
        this.drawTopcolorBg();
        break;
    }
  }

  public update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  public resize(width: number, height: number): void {
    console.log("resize background");
    switch (this.backgroundConfig.mode) {
      case "tiled":
        // To be a scene we must have the resize method even if we don't use it.
        this.tiledBg.width = width;
        this.tiledBg.height = height;
        break;
      case "topcolor":
        this.colorBg.width = width;
        this.colorBg.height = height;

        const resized = calculateSize(
          this.tiledBg.texture.baseTexture.width,
          this.tiledBg.texture.baseTexture.height,
          0,
          115
        );

        this.tiledBg.width = this.bgWidth;
        this.tiledBg.height = resized.newHeight;
        this.tiledBg.tileScale.x = this.tiledBg.tileScale.y =
          resized.newHeight / this.tiledBg.texture.height;
        break;
    }
  }

  drawTiledBg(): void {
    this.tiledBg.tileScale.x = this.tiledBg.tileScale.y = 0.3;
    this.addChild(this.tiledBg);
  }

  drawTopcolorBg(): void {
    this.colorBg = new Sprite(Texture.WHITE);
    this.colorBg.width = this.bgWidth;
    this.colorBg.height = this.bgHeight;
    this.colorBg.tint = this.backgroundConfig.bgcolor || 0x0;
    this.addChild(this.colorBg);

    this.tiledBg = new TilingSprite(
      Texture.from(this.backgroundConfig.name),
      this.bgWidth,
      0
    );

    const resized = calculateSize(
      this.tiledBg.texture.baseTexture.width,
      this.tiledBg.texture.baseTexture.height,
      0,
      115
    );

    this.tiledBg.height = resized.newHeight;
    this.tiledBg.tileScale.x = this.tiledBg.tileScale.y =
      resized.newHeight / this.tiledBg.texture.height;
    this.addChild(this.tiledBg);
  }
}
