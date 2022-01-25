import { Gameobject } from "./Gameobject";
import { Scene } from "../Scene/Scene";
import { Stats } from "../Stats";
import { Vector } from "../Vector";
import { Number } from "../GameObject/Number";

class ToolIcon extends Gameobject
{
    private scene_: Scene;
    private stats_: Stats;
    private gridSize_: number;
    private statName_: string;
    private statValue_: number;
    private toolImg_: HTMLImageElement;
    private numObj_: Number;
    
    constructor(scene: Scene, stats: Stats, name: string, tag: string, ID: number, position: Vector, gridSize: number, statName: string, imgPath: string)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = 320;
        this.height_ = 320;

        this.scene_ = scene;
        this.stats_ = stats;
        this.gridSize_ = gridSize;
        this.statName_ = statName;
        this.statValue_ = this.stats_.GetStat(statName);

        var numOfDigits: number = 0;
        var digitCalc: number = this.statValue_; //temp number - divide by 10 until it goes below 1 - the number of iterations = number of digits
        do
        {
            numOfDigits++;
            digitCalc /= 10;
        } while (digitCalc >= 1)

        const digitSize: number = 8 / numOfDigits;
        const scale: number = this.gridSize_ * (digitSize / 32) / 50;
        const numPos: Vector = new Vector(this.position_.x + (this.gridSize_ * (24/32)) - ((numOfDigits - 1) * 4), 
                                          this.position_.y + (this.gridSize_ * ((32 - digitSize - numOfDigits * 2)/32)));
        this.numObj_ = new Number(this.statName_, "Icon", 0, numPos, this.statValue_, scale, "#c0b0a8");
        this.scene_.Add(this.numObj_);

        this.toolImg_ = new Image();
        this.toolImg_.src = imgPath;
    }

    public Update(delta_time: number) 
    {
        if (this.statValue_ === this.stats_.GetStat(this.statName_)) return; //if value dosen't change, return

        this.SetPosAndScale();

        // this.statValue_ = this.stats_.GetStat(this.statName_); //get stat
        // this.numObj_.SetNumber(this.statValue_); //reset number

        // const numPos: Vector = new Vector(this.position_.x + (this.gridSize_ * (24/32)) - ((this.numObj_.DIGITS - 1) * 4), this.position_.y + (this.gridSize_ * (24/32)));
        // this.numObj_.Position = numPos;
    }

    public TurnUpdate(turnsPassed: number) 
    {}

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null) return;

        main_ctx.drawImage(this.toolImg_, 0, 0, this.toolImg_.naturalWidth, this.toolImg_.naturalHeight, this.position_.x, this.position_.y, this.gridSize_, this.gridSize_);
    }

    private SetPosAndScale()
    {
        this.statValue_ = this.stats_.GetStat(this.statName_); //get stat
        var digits: number = 0;
        var digitCalc: number = this.statValue_; //temp number - divide by 10 until it goes below 1 - the number of iterations = number of digits
        do
        {
            digits++;
            digitCalc /= 10;
        } while (digitCalc >= 1)

        const digitSize: number = 8 / digits;
        const scale: number = this.gridSize_ * (digitSize / 32) / 50;
        const numPos: Vector = new Vector(this.position_.x + (this.gridSize_ * (24/32)) - ((digits - 1) * 4), 
                                          this.position_.y + (this.gridSize_ * ((32 - digitSize - digits * 2)/32)));
        this.numObj_.SetNumber(this.statValue_, scale);
        this.numObj_.Position = numPos;
    }
}

export {ToolIcon};