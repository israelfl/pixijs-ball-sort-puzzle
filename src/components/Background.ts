import { Container, Sprite, Texture, TilingSprite } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { calculateSize } from "../recipes/Utils";

export default class Background extends Container implements IScene {
  private tiledBg: TilingSprite = new TilingSprite(
    Texture.from(Manager.loadedConfig.background.name),
    Manager.width,
    Manager.height
  );
  private colorBg: Sprite = new Sprite(Texture.WHITE);
  //private bgSprite: Sprite = new TilingSprite(Texture.WHITE);

  constructor() {
    super();

    switch (Manager.loadedConfig.background.mode) {
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
    switch (Manager.loadedConfig.background.mode) {
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

        this.tiledBg.width = Manager.width;
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
    this.colorBg.width = Manager.width;
    this.colorBg.height = Manager.height;
    this.colorBg.tint = Manager.loadedConfig.background.bgcolor || 0x0;
    this.addChild(this.colorBg);

    this.tiledBg = new TilingSprite(
      Texture.from(Manager.loadedConfig.background.name),
      Manager.width,
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

  // drawTopcolorBg(): void {
  //   this.colorBg = new Sprite(Texture.WHITE);
  //   this.colorBg.width = Manager.width;
  //   this.colorBg.height = Manager.height;
  //   this.colorBg.tint = Manager.loadedConfig.background.bgcolor || 0x0;
  //   this.addChild(this.colorBg);

  //   this.bgSprite = Sprite.from(Manager.loadedConfig.background.name);

  //   const resized = calculateSize(
  //     this.bgSprite.texture.baseTexture.width,
  //     this.bgSprite.texture.baseTexture.height,
  //     Manager.width
  //   );

  //   this.bgSprite.width = resized.newWidth;
  //   this.bgSprite.height = resized.newHeight;

  //   console.log("resized", resized);
  //   this.addChild(this.bgSprite);

  // }
}
