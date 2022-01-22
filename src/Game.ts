import { Scene } from "./Scene/Scene";
import { Stats } from "./Stats";
//Scenes
import { GameScene } from "./Scene/GameScene";
import { MenuScene } from "./Scene/MenuScene";
import { ShopScene } from "./Scene/ShopScene";
import { LevelSelectScene } from "./Scene/LevelSelectScene";


class Game
{
    private currentScene_: string;
    private scenes_: Map<string, Scene>;
    private stats_: Stats;

    constructor()
    {
        this.stats_ = new Stats();

        this.currentScene_ = "Menu";
        this.scenes_ = new Map<string, Scene>();
        this.SetScenes();
        this.ChangeScene(this.currentScene_);
    }

    private SetScenes()
    {
        this.scenes_.set("Game", new GameScene(this));
        this.scenes_.set("Menu", new MenuScene(this));
        this.scenes_.set("Shop", new ShopScene(this));
        this.scenes_.set("LevelSelect", new LevelSelectScene(this));
    }

    public ChangeScene(sceneName: string)
    {
        this.scenes_.get(this.currentScene_)?.End();
        this.currentScene_ = sceneName;
        this.scenes_.get(this.currentScene_)?.Init();
    }

    public Update(delta_time: number) 
    {
        this.scenes_.get(this.currentScene_)?.Update(delta_time);
    }

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null)
    {
        this.scenes_.get(this.currentScene_)?.Draw(main_ctx, grid_ctx);
    }

    public GetStats() : Stats
    {
        return this.stats_;
    }
}

export {Game};