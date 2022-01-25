import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class Number extends Gameobject
{
    //Arguments
    private number_: number;
    private scale_: number;
    private color_: string;
    //Image
    private img_: HTMLImageElement;
    private canvas_: HTMLCanvasElement | null;
    private ctx_: CanvasRenderingContext2D | null;
    //
    private digits_: number[];

    //TEST
    private thingsToLoad_: number = 0;

    constructor(name: string, tag: string, ID: number, position: Vector, number: number, scale?: number, color?: string)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.number_ = number;
        this.scale_ = scale === undefined ? 1 : scale;
        this.color_ = color === undefined ? "#ffffff" : color;

        this.width_ = 4 * 10; //width of one number in the "number" texture
        this.height_ = 5 * 10; //height of one number in the "number" texture

        this.img_ = new Image();
        this.img_.src = "./Numbers.png";
        this.canvas_ = document.createElement("canvas");
        if (this.canvas_ !== null) this.ctx_ = this.canvas_.getContext("2d");
        else this.ctx_ = null;

        this.digits_ = [];
        this.thingsToLoad_++;
        this.img_.onload = this.OnLoad;
    }

    private Init()
    {//once the image loads
        this.GetDigits();
        this.SetTempCanvas();
    }

    private OnLoad = () =>
    {
        this.thingsToLoad_--;
        if (this.thingsToLoad_ <= 0) this.Init();
    }

    public Update(delta_time: number) 
    {}

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {}

    public DelayedDraw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null || grid_ctx === null || this.ctx_ === null || this.canvas_ === null) return;

        main_ctx.drawImage(this.canvas_, 0, 0, this.canvas_.width, this.canvas_.height, this.position_.x, this.position_.y, this.canvas_.width, this.canvas_.height);
    }

    public SetNumber(number: number, scale?: number, color?: string)
    {
        this.number_ = number;
        this.scale_ = scale === undefined? this.scale_ : scale;
        this.color_ = color === undefined? this.color_ : color;
        this.digits_ = [];
        this.GetDigits();
        this.SetTempCanvas();
    }

    private GetDigits()
    {
        var numOfDigits: number = 0;
        var digitCalc: number = this.number_; //temp number - divide by 10 until it goes below 1 - the number of iterations = number of digits
        do
        {
            numOfDigits++;
            digitCalc /= 10;
        } while (digitCalc >= 1)

        var sub: number = 0; //I use this to subtract from the given number to get the right digit
        for (var i = 0; i < numOfDigits; i++)
        {
            const front: number = this.number_ - sub; //get the the right digit (I.E. Hundreds / Tens / Etc)
            const back: number = Math.pow(10, (numOfDigits - 1 - i)); //divde by the right multiple (100 / 10 / Etc)
            const answer: number = back === 0 ? Math.floor(front) : Math.floor(front / back); //divide the digit by the multiple to get the number

            this.digits_.push(answer)

            sub += answer * back; //update this value for next iteration
        }
    }

    private SetTempCanvas()
    {
        if (this.ctx_ === null || this.canvas_ === null) return;
        //change canvas size - matters when the num of digits change
        this.canvas_.width = this.width_ * this.digits_.length * this.scale_;
        this.canvas_.height = this.height_ * this.scale_;

        //temp canvas to first place the numbers
        //this has to be done on a seperate canvas as the "globalCompositeOperation" only works on the last drawn thing
        //because more then 1 number is drawn before this opperation, it doesn't work as intended (numbers don't show up at all)
        //Thus the opperation must be drawn after drawing the temp canvas to the canvas
        //NOTE: the temp canvas will go out of scope, so no need to delete it (this happens because it wasn't attached to a parent? I think. I hope...)
        var tempCanvas: HTMLCanvasElement | null;
        var tempCtx: CanvasRenderingContext2D | null;
        tempCanvas = document.createElement("canvas");
        tempCanvas.width = this.width_ * this.digits_.length * this.scale_;
        tempCanvas.height = this.height_ * this.scale_;
        if (tempCanvas !== null) tempCtx = tempCanvas.getContext("2d");
        else tempCtx = null;

        if (tempCtx === null) return;
        for (var i = 0; i < this.digits_.length; i++)
        {//draw each digit to the temp canvas
            tempCtx.drawImage(this.img_, this.digits_[i] * this.width_, 0, this.width_, this.height_, i * this.width_ * this.scale_, 0, this.width_ * this.scale_, this.height_ * this.scale_); //texture pos then global pos
        }

        //draw temp canvas to the canvas and then apply the color
        this.ctx_.fillStyle = this.color_;
        this.ctx_.fillRect(0, 0, this.width_ * this.digits_.length * this.scale_, this.height_ * this.scale_);
        this.ctx_.globalCompositeOperation = "destination-in";
        this.ctx_.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
    }

    get NUMBER(): number {return this.number_}; //return the number
    get DIGITS(): number {return this.digits_.length;}; //returns the number of digits
}

export {Number};