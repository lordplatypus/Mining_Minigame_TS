import { Gameobject } from "../GameObject/Gameobject";
import { Vector } from "../Vector";

class Button extends Gameobject
{
    protected size_: Vector = new Vector(0, 0);
    protected text_: string = "";
    protected textSize_: number = 0;
    protected font_: string = "";
    protected textColor_: string = "";
    protected color_: string = "";
    protected highlightColor_: string = "";
    protected highlighted_: boolean = false;

    public Update(delta_time: number) 
    {}

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null) return;
    }

    public DelayedDraw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null) return;

        //TEST
        if (this.highlighted_) main_ctx.fillStyle = this.highlightColor_;
        else main_ctx.fillStyle = this.color_;
        main_ctx.fillRect(this.position_.x, this.position_.y, this.size_.x, this.size_.y);
        main_ctx.font = this.textSize_ + "px " + this.font_;
        main_ctx.fillStyle = this.textColor_;
        main_ctx.fillText(this.text_, this.position_.x, this.position_.y + this.textSize_);
    }

    public Effect()
    {
        console.log("Button Effect");
    }

    set Size(size: Vector) {this.size_ = size;}
    get Size() {return this.size_;}
    set Highlight(highlighted: boolean) {this.highlighted_ = highlighted;}
    get Highlight() {return this.highlighted_;}
}

export {Button};