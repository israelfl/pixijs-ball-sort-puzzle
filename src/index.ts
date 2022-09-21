import { Manager } from "./Manager";
import { LoaderScene } from "./scenes/LoaderScene";

//Manager.initialize(0x111111);
Manager.initialize(0xffffff);

// We no longer need to tell the scene the size because we can ask Manager!
const loady: LoaderScene = new LoaderScene();
Manager.changeScene(loady);
