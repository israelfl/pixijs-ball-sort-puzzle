import { Container, InteractionEvent } from "pixi.js";
import { IScene, Manager } from "../../Manager";
import { backgroundAssets } from "../../assets/background-assets";
import BackgroundItem from "../BackgroundItem";
import Circle from "../Circle";
import { ColorReplaceFilter } from "pixi-filters";

type paginationConfig = {
  width: number;
  marginX: number;
  height: number;
  marginY: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  fitItemsX: number;
  fitItemsY: number;
  gridSize: number;
};

export default class ThemeSelector extends Container implements IScene {
  private bgFrames: Container[] = [];

  private paginationConfig: paginationConfig = {
    width: 250,
    marginX: 20,
    height: 250,
    marginY: 20,
    totalItems: backgroundAssets.length,
    totalPages: 1,
    currentPage: 1,
    fitItemsX: 0,
    fitItemsY: 0,
    gridSize: 0,
  };

  constructor() {
    super();

    setTimeout(() => {
      this.calculatePagination();
      this.drawBgBtns();
      this.drawPaginationCircles();
    }, 200);
  }

  update(_framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  resize(_width: number, _height: number): void {}

  calculatePagination(): void {
    this.paginationConfig.fitItemsX = Math.floor(
      Manager.width /
        (this.paginationConfig.width + this.paginationConfig.marginX)
    );
    this.paginationConfig.fitItemsY = Math.floor(
      (Manager.height - this.worldTransform.ty) /
        (this.paginationConfig.height + this.paginationConfig.marginY)
    );
    this.paginationConfig.gridSize =
      this.paginationConfig.fitItemsX * this.paginationConfig.fitItemsY;
    this.paginationConfig.totalPages = Math.ceil(
      this.paginationConfig.totalItems / this.paginationConfig.gridSize
    );
  }

  drawBgBtns(): void {
    let bgFrame = new Container();
    let j = 0;
    for (let i = 0; i < this.paginationConfig.totalItems; i++) {
      j++;
      const bgBtn = new BackgroundItem(
        backgroundAssets[i].title,
        backgroundAssets[i],
        this.paginationConfig.width,
        this.paginationConfig.height
      );
      bgBtn.x =
        Math.floor(i % this.paginationConfig.fitItemsX) *
        (this.paginationConfig.width + this.paginationConfig.marginX);
      bgBtn.y =
        Math.floor((j - 1) / this.paginationConfig.fitItemsX) *
        (this.paginationConfig.height + this.paginationConfig.marginY);
      bgFrame.addChild(bgBtn);

      if (j === this.paginationConfig.gridSize) {
        this.bgFrames.push(bgFrame);
        bgFrame.x = Manager.width / 2 - bgFrame.width / 2;
        bgFrame.y = 50;
        bgFrame.visible = i + 1 === this.paginationConfig.gridSize;
        this.addChild(bgFrame);
        bgFrame = new Container();
        j = 0;
      }
    }

    if (j !== 0) {
      this.bgFrames.push(bgFrame);
      bgFrame.x = Manager.width / 2 - bgFrame.width / 2;
      bgFrame.y = 50;
      bgFrame.visible = this.paginationConfig.totalPages === 1;
      this.addChild(bgFrame);
    }
  }

  drawPaginationCircles(): void {
    let paginationFrame = new Container();
    const normalColor = 0xdfdfdf;
    const activeColor = 0x49b728;
    for (let i = 1; i <= this.paginationConfig.totalPages; i++) {
      let circle = new Circle(normalColor, 15, false);
      if (i === this.paginationConfig.currentPage) {
        circle.scale.x = circle.scale.y = 1.3;
        circle.filters = [new ColorReplaceFilter(normalColor, activeColor, 0.001)];
      }

      circle.x = Math.floor((i - 1) % this.paginationConfig.totalPages) * 40;
      circle.interactive = true;

      circle.on(
        "pointertap",
        (_e: InteractionEvent) => {
          this.bgFrames[this.paginationConfig.currentPage - 1].visible = false;
          this.bgFrames[i - 1].visible = true;

          paginationFrame.children[
            this.paginationConfig.currentPage - 1
          ].scale.x = paginationFrame.children[
            this.paginationConfig.currentPage - 1
          ].scale.y = 1;

          paginationFrame.children[
            this.paginationConfig.currentPage - 1
          ].filters = [new ColorReplaceFilter(activeColor, normalColor, 0.001)];

          this.paginationConfig.currentPage = i;

          paginationFrame.children[i - 1].scale.x = paginationFrame.children[
            i - 1
          ].scale.y = 1.3;

          paginationFrame.children[i - 1].filters = [
            new ColorReplaceFilter(normalColor, activeColor, 0.001),
          ];
        },
        this
      );

      paginationFrame.addChild(circle);
    }

    paginationFrame.x = Manager.width / 2 - paginationFrame.width / 2;
    paginationFrame.y = 20;

    this.addChild(paginationFrame);
    console.log(this.paginationConfig.totalPages);
  }
}
