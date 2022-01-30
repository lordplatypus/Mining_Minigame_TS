import { Gameobject } from "../GameObject/Gameobject";
import { Scene } from "../Scene/Scene";
import { Stats } from "../Stats";
import { Vector } from "../Vector";
import { Calculations } from "../Calculations";
//import { Text } from "../GameObject/Text";
import { ParticleManager } from "../Particles/ParticleManager";

class Treasure extends Gameobject
{
    private stats_: Stats;
    private scene_: Scene;
    private mainCellSize_: number;
    private gridCellSize_: number;
    private mainRows_: number;
    private mainColumns_: number;
    private calcs_: Calculations;
    private done_: boolean;
    private pm_: ParticleManager;

    private IDs_: number[];
    private img_: HTMLImageElement;
    private value_: number;

    constructor(scene: Scene, stats: Stats, name: string, tag: string, IDs: number[], position: Vector, size: Vector, imgPath: string, value: number, gridCellSize: number, mainCellSize: number, mainRows: number, mainColumns: number)
    {
        super();
        this.stats_ = stats;
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.IDs_ = IDs;
        this.ID_ = this.IDs_[0];
        this.position_ = new Vector(position.x, position.y);
        this.width_ = size.x;
        this.height_ = size.y;
        this.mainCellSize_ = mainCellSize;
        this.gridCellSize_ = gridCellSize;
        this.mainRows_ = mainRows;
        this.mainColumns_ = mainColumns;
        this.img_ = new Image();
        this.img_.src = imgPath;
        this.value_ = value;

        this.calcs_ = new Calculations();
        this.done_ = false;

        this.pm_ = new ParticleManager(scene);
    }

    public Update(delta_time: number) 
    {}

    public TurnUpdate(turnsPassed: number) 
    {
        if (this.done_) return;

        // var localPosition : Vector = this.calcs_.ConvertWorldToLocal(new Vector(this.position_.x, this.position_.y), this.gridCellSize_);
        // if (localPosition === null) return;
        // var ID : number = this.calcs_.ConvertLocalToID(localPosition, this.rows_, this.columns_);
        // if (ID === null) return;

        if (this.Uncover() && !this.done_) 
        {//if no dirt object shares the same location, then the coin is collected
            this.UncoverEffect();
            this.done_ = true; //done, don't need to update anymore
        }
    }

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (grid_ctx === null) return;
        grid_ctx.drawImage(this.img_, 0, 0, this.img_.naturalWidth, this.img_.naturalHeight, this.position_.x, this.position_.y, this.width_, this.height_);
    }

    private Uncover(): boolean
    {
        for (var i = 0; i < this.IDs_.length; i++)
        {
            if (this.scene_.Search("Dirt", "Dirt", this.IDs_[i]) !== null) return false;
        }
        return true;
    }

    private UncoverEffect()
    {
        var currentMoney: number = this.stats_.GetStat("Money"); //get current money
        currentMoney += this.value_; //add money
        this.stats_.SetStat("Money", currentMoney); //set money
        //Particle effect (raising text)
        const textPosition: Vector = this.calcs_.ConvertGridToMain(this.position_, new Vector(0, this.mainCellSize_ * 2), new Vector(this.mainCellSize_ * 8, this.mainCellSize_ * 8), new Vector(this.gridCellSize_ * this.mainColumns_, this.gridCellSize_ * this.mainRows_));
        this.pm_.RaisingText(textPosition, "+" + this.value_, this.gridCellSize_);
    }
}

export {Treasure};