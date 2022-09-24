import {
  Container,
  InteractionEvent,
  Sprite,
  TextStyle,
  Texture,
  Text,
  Graphics,
} from "pixi.js";
import { ColorReplaceFilter } from "pixi-filters";
import { IScene, Manager } from "../Manager";
import BallSelector from "../components/shop/BallSelector";
import TubeSelector from "../components/shop/TubeSelector";
import ThemeSelector from "../components/shop/ThemeSelector";

type shopTabsDef = {
  title: string;
  asset: string;
  component: BallSelector | TubeSelector | ThemeSelector;
};

export default class ShopScene extends Container implements IScene {
  private currentTab: number = 0;

  private shopTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 40,
    fontWeight: "bolder",
    stroke: "black",
    strokeThickness: 4,
  });

  private coinsTextStyle = new TextStyle({
    align: "center",
    fill: "white",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 24,
    fontWeight: "bolder",
    stroke: "black",
    strokeThickness: 4,
  });

  private tabsConfig: shopTabsDef[] = [
    { title: "Ball", asset: "icon-ball", component: new BallSelector() },
    { title: "Tube", asset: "icon-tube", component: new TubeSelector() },
    { title: "Theme", asset: "icon-theme", component: new ThemeSelector() },
  ];
  private bg: Sprite = new Sprite(Texture.WHITE);
  private backBtn: Sprite = Sprite.from("button-back");
  private coinsBtn: Sprite = Sprite.from("button-crown-coin");
  private coinsNumber: Text = new Text("");
  private topFrame: Container = new Container();
  private tabsFrame: Container = new Container();
  private tabsContentFrame: Container = new Container();
  private shopText: Text = new Text("");

  constructor() {
    super();
    this.drawScene();
    this.switchTab(2);
  }

  update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  resize(_width: number, _height: number): void {
    // To be a scene we must have the resize method even if we don't use it.
  }

  drawScene(): void {
    this.drawBg();
    this.drawBackBtn();
    this.drawShopText();
    this.drawCoins();
    this.drawTopFrame();
    this.drawTabsFrame();
  }

  drawBg(): void {
    this.bg.width = Manager.width;
    this.bg.height = Manager.height;
    this.bg.alpha = 1;
    this.bg.tint = 0x000000;
    this.bg.interactive = true;
    this.addChild(this.bg);
  }

  drawBackBtn(): void {
    this.backBtn.scale.x = this.backBtn.scale.y = 0.5;
    this.backBtn.interactive = true;
    this.backBtn.on("pointertap", this.backToMenu, this);
    this.topFrame.addChild(this.backBtn);
  }

  drawShopText(): void {
    this.shopText.text = this.tabsConfig[0].title.toUpperCase();
    this.shopText.style = this.shopTextStyle;
    this.shopText.y = this.topFrame.height / 2 - this.shopText.height / 2;
    this.shopText.x = Manager.width / 2 - this.shopText.width / 2;
    this.topFrame.addChild(this.shopText);
  }

  drawCoins(): void {
    this.coinsNumber.text = (43560).toString();
    this.coinsNumber.style = this.coinsTextStyle;
    this.coinsNumber.y = this.topFrame.height / 2 - this.coinsNumber.height / 2;
    this.coinsNumber.x = Manager.width - this.coinsNumber.width;
    this.topFrame.addChild(this.coinsNumber);

    this.coinsBtn.scale.x = this.coinsBtn.scale.y = 0.27;
    this.coinsBtn.x =
      Manager.width - this.coinsNumber.width - this.coinsBtn.width;
    this.coinsBtn.y = this.topFrame.height / 2 - this.coinsBtn.height / 2;
    this.coinsBtn.tint = 0xefff1c;

    this.topFrame.addChild(this.coinsBtn);
  }

  drawTopFrame(): void {
    this.topFrame.y = 10;
    this.addChild(this.topFrame);
  }

  drawTabsFrame(): void {
    const spacing = 5;
    const width =
      Manager.width / this.tabsConfig.length - spacing / this.tabsConfig.length;
    this.tabsConfig.forEach((tabItem, tabIndex) => {
      const tabRender = new Graphics();
      tabRender.lineStyle(0);
      tabRender.beginFill(0xbfbfbf, 1);
      tabRender.drawRect(0, 0, width - spacing, 50);
      tabRender.endFill();
      tabRender.x = width * tabIndex + spacing;
      tabRender.interactive = true;
      tabRender.on(
        "pointertap",
        (_e: InteractionEvent) => this.tabClick(_e, tabIndex),
        this
      );
      this.tabsFrame.addChild(tabRender);

      const icon = Sprite.from(tabItem.asset);
      icon.scale.x = icon.scale.y = 0.3;
      icon.x =
        width * tabIndex +
        (tabIndex === 0 ? 0 : spacing) +
        (width / 2 - icon.width / 2);
      icon.y = tabRender.height / 2 - icon.height / 2;
      icon.filters = [new ColorReplaceFilter(0x0, 0x333333, 0.001)];
      this.tabsFrame.addChild(icon);

      if (tabIndex !== 0) tabItem.component.visible = false;
      tabItem.component.y = 60;
      this.tabsContentFrame.addChild(tabItem.component);
      this.tabsContentFrame.y = this.topFrame.height + this.topFrame.y;
      this.addChild(this.tabsContentFrame);
    });
    this.tabsFrame.y = this.topFrame.height + this.topFrame.y;
    this.addChild(this.tabsFrame);
  }

  backToMenu(_e: InteractionEvent): void {
    this.destroy();
  }

  tabClick(_e: InteractionEvent, tabIndex: number): void {
    if (this.currentTab === tabIndex) return;
    this.switchTab(tabIndex);
  }

  switchTab(tabIndex: number): void {
    if (this.currentTab === tabIndex) return;
    this.tabsConfig[this.currentTab].component.visible = false;
    this.currentTab = tabIndex;
    this.shopText.text = this.tabsConfig[this.currentTab].title.toUpperCase();
    this.tabsConfig[this.currentTab].component.visible = true;
  }
}
