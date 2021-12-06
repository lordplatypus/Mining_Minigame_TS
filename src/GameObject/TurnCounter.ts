import { Gameobject } from "./Gameobject";
import { Scene } from "../Scene/Scene";
import { Vector } from "../Vector";

class TurnCounter extends Gameobject
{
    private scene_: Scene;
    private gridSize_: number;
    private maxTurns_: number;

    private turnCount_: number;
    private turnsTillNextCrack_: number;
    private backgroundImgs_: HTMLImageElement[];
    private numOfSections_: number;
    private crackImgs_: HTMLImageElement[];
    private crackUpImg_: HTMLImageElement;
    private crackDownImg_: HTMLImageElement;
    private isUp_: boolean;

    constructor(scene: Scene, name: string, tag: string, ID: number, position: Vector, size: Vector, gridSize: number, maxTurns: number)
    {
        super();
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = size.x;
        this.height_ = size.y;
        this.gridSize_ = gridSize;
        this.maxTurns_ = maxTurns;

        this.turnCount_ = 0;

        this.backgroundImgs_ = [];
        this.numOfSections_ = this.width_ / this.gridSize_;
        for (var i = 0; i < this.numOfSections_; i++)
        {
            this.backgroundImgs_.push(new Image());
            this.backgroundImgs_[i].src = "./Top_Panel_Background.png"
        }

        this.turnsTillNextCrack_ = this.maxTurns_ / this.numOfSections_;

        this.crackImgs_ = [];
        this.crackUpImg_ = new Image();
        this.crackUpImg_.src = "./Top_Panel_Crack_Up.png";
        this.crackDownImg_ = new Image();
        this.crackDownImg_.src = "./Top_Panel_Crack_Down.png";
        this.isUp_ = false;
    }

    public Update(delta_time: number) 
    {}

    public TurnUpdate() 
    {
        // this.width_ -= this.shrink;
        // if (this.width_ <= 0)
        // {
        //     var player: Gameobject | null = this.scene_.Search("Player", "Player", 0);
        //     if (player !== null) player.Kill();
        //     console.log(player);
        // }

        this.turnCount_++;
        if (this.turnCount_ >= this.maxTurns_)
        {
            var player: Gameobject | null = this.scene_.Search("Player", "Player", 0);
            if (player !== null) player.Kill();
            console.log(player);
        }

        if (this.turnCount_ >= this.turnsTillNextCrack_)
        {
            this.turnsTillNextCrack_ += this.maxTurns_ / this.numOfSections_;
            this.crackImgs_.push(new Image());
            this.crackImgs_[this.crackImgs_.length - 1].src = "./Top_Panel_Crack.png";

            if (this.isUp_) this.isUp_ = false;
            else this.isUp_ = true;
        }
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
        //TEST
        // ctx.fillStyle = "#00ffff";
        // ctx.fillRect(this.position_.x, this.position_.y, this.width_, this.height_);

        for (var i = 0; i < this.numOfSections_; i++)
        {
            ctx.drawImage(this.backgroundImgs_[i], 0, 0, this.backgroundImgs_[i].naturalWidth, this.backgroundImgs_[i].naturalHeight, 
                this.position_.x + (i * this.gridSize_), this.position_.y, this.gridSize_, this.height_);
        }

        for (var i = 0; i < this.crackImgs_.length; i++)
        {
            if (i % 2 === 0)
            {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(this.crackImgs_[i], 0, 0, this.crackImgs_[i].naturalWidth, this.crackImgs_[i].naturalHeight, 
                    -(this.position_.x + this.width_ - (i * this.gridSize_)), this.position_.y, this.gridSize_, this.height_);
                ctx.restore();
            }
            else ctx.drawImage(this.crackImgs_[i], 0, 0, this.crackImgs_[i].naturalWidth, this.crackImgs_[i].naturalHeight, 
                this.position_.x + (this.width_ - this.gridSize_) - (i * this.gridSize_), this.position_.y, this.gridSize_, this.height_);
        }

        if (this.isUp_) ctx.drawImage(this.crackUpImg_, 0, 0, this.crackUpImg_.naturalWidth, this.crackUpImg_.naturalHeight, 
            this.position_.x + (this.width_ - this.gridSize_) - (this.crackImgs_.length * this.gridSize_), this.position_.y, this.gridSize_, this.height_);
        else ctx.drawImage(this.crackDownImg_, 0, 0, this.crackDownImg_.naturalWidth, this.crackDownImg_.naturalHeight, 
            this.position_.x + (this.width_ - this.gridSize_) - (this.crackImgs_.length * this.gridSize_), this.position_.y, this.gridSize_, this.height_);
    }

    public DelayedDraw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
    }
}

export {TurnCounter};