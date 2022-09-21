import {
  Container,
  Graphics,
  InteractionEvent,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";

import { IScene } from "../Manager";

interface IProps {
  menuFrame: Graphics;
  assetIcon: string;
  buttonText: string;
  toggleIcon: string;
  action?: any;
}

export default class ButtonAction extends Container implements IScene {
  private textStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 40,
    fontWeight: "bolder",
  });

  private buttonContainer: Container = new Container();
  public btnIcon: Sprite = new Sprite();
  public btnToggleIcon: Sprite = new Sprite();
  private btnText: Text = new Text("");

  constructor(props: IProps) {
    super();

    this.btnIcon = Sprite.from(props.assetIcon);
    this.btnIcon.scale.x = this.btnIcon.scale.y = 0.5;
    this.buttonContainer.addChild(this.btnIcon);

    if (props.toggleIcon !== "") {
      this.btnToggleIcon = Sprite.from(props.toggleIcon);
      this.btnToggleIcon.scale.x = this.btnToggleIcon.scale.y = 0.5;
      this.btnToggleIcon.visible = false;
      this.buttonContainer.addChild(this.btnToggleIcon);
    } else {
      this.btnToggleIcon = this.btnIcon;
    }

    this.btnText.text = props.buttonText;
    this.btnText.style = this.textStyle;
    this.btnText.x = this.btnIcon.getBounds().right + 10;
    this.btnText.y =
      this.btnIcon.getBounds().height / 2 - this.btnText.height / 2;
    this.buttonContainer.addChild(this.btnText);

    this.buttonContainer.interactive = true;
    this.buttonContainer.on("pointertap", (e: InteractionEvent): void => {
      props.action(e, {
        btnIcon: this.btnIcon,
        btnToggleIcon: this.btnToggleIcon,
      });
    });

    this.buttonContainer.x = 20;
    this.buttonContainer.y = 70;

    this.addChild(this.buttonContainer);
  }

  update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
  }
}
