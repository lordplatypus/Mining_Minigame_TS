import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class FadingText extends Gameobject
{
    private size_: number;
    private text_: string;
    private color_: string;

    private alpha_: number;

    constructor(name: string, tag: string, ID: number, position: Vector, size: number, text: string, color: string)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.size_ = size;
        this.text_ = text;
        this.color_ = color;

        this.alpha_ = 1.0;
    }

    public Update(delta_time: number) 
    {
        if (this.alpha_ <= 0) this.Kill();
        else this.alpha_ -= delta_time;
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
    }

    public DelayedDraw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null || this.alpha_ <= 0) return;

        //TEST
        ctx.fillStyle = this.color_;
        ctx.globalAlpha = this.alpha_;
        ctx.font =  this.size_ + 'px serif';
        ctx.fillText(this.text_, this.position_.x, this.position_.y + this.size_);
        ctx.globalAlpha = 1.0; //reset global alpha so it doesn't effect everything else
    }
}

export {FadingText};