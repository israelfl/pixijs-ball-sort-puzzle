import { Container, InteractionEvent, Sprite, Text, TextStyle } from "pixi.js";
import { IScene, Manager } from "../Manager";
import MainScene from "../scenes/MainScene";
import MenuScene from "../scenes/MenuScene";

interface IProps {
  resetAction: () => void;
  mainScene: MainScene;
}

export default class HeaderButtons extends Container implements IScene {
  private levelTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 40,
    fontWeight: "bolder",
    stroke: "black",
    strokeThickness: 4,
  });

  private btnMenu: Sprite = Sprite.from("button-menu");
  private btnReload: Sprite = Sprite.from("button-reload");
  private btnAddTube: Sprite = Sprite.from("button-add-tube");
  private btnUndo: Sprite = Sprite.from("button-undo");
  private undoCount: Text = new Text((5).toString());
  private levelText: Text = new Text("LEVEL " +
    (Manager.loadedConfig.currentLevel || 1).toString()
  );

  constructor(props: IProps) {
    super();

    this.btnMenu.scale.x = this.btnMenu.scale.y = 0.5;
    this.btnMenu.x = 0;
    this.btnMenu.y = 20;
    this.btnMenu.interactive = true;
    this.btnMenu.on("pointertap", this.showMenu, this);
    this.addChild(this.btnMenu);

    this.btnReload.scale.x = this.btnReload.scale.y = 0.5;
    this.btnReload.x = this.btnMenu.getBounds().right;
    this.btnReload.y = 20;
    this.btnReload.interactive = true;
    this.btnReload.on("pointertap", props.resetAction, props.mainScene);
    this.addChild(this.btnReload);

    this.btnAddTube.scale.x = this.btnAddTube.scale.y = 0.5;
    this.btnAddTube.x = Manager.width - this.btnAddTube.width;
    this.btnAddTube.y = 20;
    this.addChild(this.btnAddTube);

    this.btnUndo.scale.x = this.btnUndo.scale.y = 0.5;
    this.btnUndo.x = this.btnAddTube.getBounds().left - this.btnUndo.width;
    this.btnUndo.y = 20;
    this.addChild(this.btnUndo);

    this.undoCount.x = this.btnUndo.getBounds().right - 30;
    this.undoCount.y = 33;
    this.addChild(this.undoCount);

    this.levelText.anchor.set(0.5, 0);
    this.levelText.x = Manager.width / 2;
    this.levelText.y = 20;
    this.levelText.style = this.levelTextStyle;
    this.addChild(this.levelText);
  }

  update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  resize(width: number, _height: number): void {
    console.log("resize HeaerButtons");
    this.btnAddTube.x = width - this.btnAddTube.width;
    this.btnUndo.x = this.btnAddTube.getBounds().left - this.btnUndo.width;
    this.undoCount.x = this.btnUndo.getBounds().right - 30;
    this.levelText.x = Manager.width / 2;
  }

  showMenu(_e: InteractionEvent): void {
    Manager.changeScene(new MenuScene(), false);
  }
}
