import { Gameobject } from "./Gameobject";
import { Scene } from "../Scene/Scene";
import { Stats } from "../Stats";
import { Vector } from "../Vector";
import { Number } from "../GameObject/Number";

class MoneyPanel extends Gameobject
{
    private scene_: Scene;
    private stats_: Stats;
    private gridSize_: number;
    private money_: number;

    private startImg_: HTMLImageElement;
    private middleImgs_: HTMLImageElement[];
    private endImg_: HTMLImageElement;

    private canvas_: HTMLCanvasElement | null;
    private ctx_: CanvasRenderingContext2D | null;

    private numObj_: Number;

    private loadDone_: boolean;
    private numToLoad_: number;
    
    constructor(scene: Scene, stats: Stats, name: string, tag: string, ID: number, position: Vector, gridSize: number)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);

        this.scene_ = scene;
        this.stats_ = stats;
        this.gridSize_ = gridSize;
        this.money_ = this.stats_.GetStat("Money");
        this.loadDone_ = false;
        this.numToLoad_ = 0;

        const scale: number = this.gridSize_ * (15/32) / 50; //(15/32) is the size of the "MONEY" text - 50 is the height of the number image
        this.numObj_ = new Number("Money", "Number", 0, new Vector(this.position_.x + 3 * this.gridSize_, this.position_.y + (this.gridSize_ * (8/32))), 
                                  this.money_, scale, "#584840");
        this.scene_.Add(this.numObj_);

        this.startImg_ = new Image();
        this.startImg_.src = "./Money_Panel.png";
        this.numToLoad_++; //add to loading "list"
        this.startImg_.onload = this.Load; //remove from loading "list" when loaded

        //const digits: number = this.numObj_.DIGITS; //not calc by this point thus this always = 0
        var numOfDigits: number = 0;
        var digitCalc: number = this.money_; //temp number - divide by 10 until it goes below 1 - the number of iterations = number of digits
        do
        {
            numOfDigits++;
            digitCalc /= 10;
        } while (digitCalc >= 1)
        this.middleImgs_ = [];
        const numOfMiddle: number = Math.floor(numOfDigits * 12 / 32);
        for (var i = 0; i < numOfMiddle; i++)
        {
            this.middleImgs_.push(new Image());
            this.middleImgs_[i].src = "./Money_Panel_Middle.png";
            this.numToLoad_++; //add to loading "list"
            this.middleImgs_[i].onload = this.Load; //remove from loading "list" when loaded
        }

        this.endImg_ = new Image();
        this.endImg_.src = "./Money_Panel_End.png";
        this.numToLoad_++; //add to loading "list"
        this.endImg_.onload = this.Load; //remove from loading "list" when loaded

        this.canvas_ = document.createElement("canvas");
        if (this.canvas_ !== null) this.ctx_ = this.canvas_.getContext("2d");
        else this.ctx_ = null;
    }

    private Load = () =>
    {//simple way to know when all images are loaded (when "numToLoad" = 0, all images are loaded)
        this.numToLoad_--;
    }

    public Update(delta_time: number) 
    {
        if (!this.loadDone_ && this.numToLoad_ <= 0)
        {//Set up the canvas once all images load
            this.loadDone_ = true;
            this.SetCanvas();
        }

        if (this.money_ === this.stats_.GetStat("Money")) return; //if money dosen't change, return

        this.money_ = this.stats_.GetStat("Money"); //get money
        this.numObj_.SetNumber(this.money_); //reset number

        //change the number of middle images are displayed if the number of digits change
        var numOfDigits: number = 0;
        var digitCalc: number = this.money_; //temp number - divide by 10 until it goes below 1 - the number of iterations = number of digits
        do
        {
            numOfDigits++;
            digitCalc /= 10;
        } while (digitCalc >= 1)
        const numOfMiddle: number = Math.floor(numOfDigits * 12 / 32);
        if (numOfMiddle === this.middleImgs_.length) return; //if the digits didn't change return
        else if (numOfMiddle > this.middleImgs_.length) 
        {//add middle images if the number of digits increase
            this.loadDone_ = false;
            for (var i = 0; i < numOfMiddle - this.middleImgs_.length; i++)
            {
                this.middleImgs_.push(new Image());
                this.middleImgs_[i].src = "./Money_Panel_Middle.png";
                this.numToLoad_++; //add to loading "list"
                this.middleImgs_[i].onload = this.Load; //remove from loading "list" when loaded
            }
        }
        else if (numOfMiddle < this.middleImgs_.length)
        {//remove a middle image if the digits decrease
            this.loadDone_ = false;
            this.middleImgs_.pop();
        }
    }

    public TurnUpdate(turnsPassed: number) 
    {}

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null || this.canvas_ === null) return;

        main_ctx.drawImage(this.canvas_, 0, 0, this.canvas_.width, this.canvas_.height, this.position_.x, this.position_.y, this.canvas_.width, this.canvas_.height);
    }

    private SetCanvas()
    {
        if (this.ctx_ === null || this.canvas_ === null) return;
        //edit canvas size if needed
        this.canvas_.width = (3 + this.middleImgs_.length + 1) * this.gridSize_; //startImg = 3 && endImg = 1
        this.canvas_.height = this.gridSize_;

        this.ctx_.drawImage(this.startImg_, 0, 0, this.startImg_.naturalWidth, this.startImg_.naturalHeight, 0, 0, 3 * this.gridSize_, this.gridSize_);
        var x: number = 3 * this.gridSize_;
        for (var i = 0; i < this.middleImgs_.length; i++)
        {
            this.ctx_.drawImage(this.middleImgs_[i], 0, 0, this.middleImgs_[i].naturalWidth, this.middleImgs_[i].naturalHeight, x, 0, this.gridSize_, this.gridSize_);
            x += this.gridSize_;
        }
        this.ctx_.drawImage(this.endImg_, 0, 0, this.endImg_.naturalWidth, this.endImg_.naturalHeight, x, 0, this.gridSize_, this.gridSize_);
    }
}

export {MoneyPanel};