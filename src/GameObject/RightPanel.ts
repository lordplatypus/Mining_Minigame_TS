import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class RightPanel extends Gameobject
{
    private gridSize_: number;
    private maxTurns_: number;

    private turn_: number;
    private crackNum_: number;

    private topImg_: HTMLImageElement;
    private middleImgs_: HTMLImageElement[];
    private numOfMiddle_: number;
    private bottomImg_: HTMLImageElement;
    private crackImg_: HTMLImageElement;
    
    constructor(name: string, tag: string, ID: number, position: Vector, size: Vector, gridSize: number, maxTurns: number)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = size.x;
        this.height_ = size.y;
        this.gridSize_ = gridSize;
        this.maxTurns_ = maxTurns;

        this.turn_ = 0;
        this.crackNum_ = 0;

        this.topImg_ = new Image();
        this.topImg_.src = "./Right_Panel_Top.png";

        this.middleImgs_ = [];
        this.numOfMiddle_ = (this.height_ / this.gridSize_) - 2;
        for (var i = 0; i < this.numOfMiddle_; i++)
        {
            this.middleImgs_.push(new Image());
            this.middleImgs_[i].src = "./Right_Panel_Middle.png";
        }

        this.bottomImg_ = new Image();
        this.bottomImg_.src = "./Right_Panel_Bottom.png";

        this.crackImg_ = new Image();
        this.crackImg_.src = "./Right_Panel_Crack.png";
    }

    public Update(delta_time: number) 
    {}

    public TurnUpdate(turnsPassed: number) 
    {
        this.turn_ += turnsPassed;

        this.crackNum_ = 640 * Math.floor(this.turn_ / Math.floor(this.maxTurns_ / 3));
        if (this.crackNum_ > 2 * 640) this.crackNum_ = 2 * 640;
    }

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null) return;

        main_ctx.drawImage(this.topImg_, 0, 0, this.topImg_.naturalWidth, this.topImg_.naturalHeight, 
            this.position_.x, this.position_.y, this.width_, this.gridSize_);

        for (var i = 0; i < this.numOfMiddle_; i++)
        {
            main_ctx.drawImage(this.middleImgs_[i], 0, 0, this.middleImgs_[i].naturalWidth, this.middleImgs_[i].naturalHeight, 
                this.position_.x, this.position_.y + this.gridSize_ + (i * this.gridSize_), this.width_, this.gridSize_);
        }

        main_ctx.drawImage(this.bottomImg_, 0, 0, this.bottomImg_.naturalWidth, this.bottomImg_.naturalHeight, 
            this.position_.x, this.position_.y + this.height_ - this.gridSize_, this.width_, this.gridSize_);

        main_ctx.drawImage(this.crackImg_, this.crackNum_, 0, 640, this.crackImg_.naturalHeight, 
            this.position_.x, this.position_.y, this.width_, this.gridSize_ * 2);
    }
}

export {RightPanel};