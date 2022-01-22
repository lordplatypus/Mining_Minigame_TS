import { Button } from "./Button";
//import { LevelSelectScene } from "../Scene/LevelSelectScene";
import { Scene } from "../Scene/Scene";
import { Vector } from "../Vector";
import { Stats } from "../Stats";
import { ParticleManager } from "../Particles/ParticleManager";

class LevelSelectButton extends Button
{
    private scene_: Scene;
    private transitionToSceneName_: string;
    private stats_: Stats | undefined;
    private pm_: ParticleManager;

    constructor(scene: Scene, stats: Stats, name: string, tag: string, ID: number, position: Vector, size: Vector, 
                imgPath: string, transitionToSceneName: string)
    {
        super();
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.size_ = size;
        this.img_ = new Image();
        this.img_.src = imgPath;

        this.transitionToSceneName_ = transitionToSceneName;
        this.stats_ = stats;
        this.pm_ = new ParticleManager(this.scene_);
    }

    public Effect()
    {
        if (this.stats_ !== undefined)
        {
            const currentRows: number | undefined = this.stats_.GetStat("Rows");
            const cost = currentRows === undefined ? 0 : (currentRows - 5) * 10; //10 gold for every extra row after 5
            const money: number | undefined = this.stats_.GetStat("Money");
            if (money === undefined || money < cost) 
            {
                this.pm_.FadingText(this.position_, "Not Enough Money", 16);
                return;
            }
            this.stats_.SetStat("Money", money - cost);
        }

        console.log("Transition Button Effect");
        this.scene_.ChangeScene(this.transitionToSceneName_);
    }
}

export {LevelSelectButton};