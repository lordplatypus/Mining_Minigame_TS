import { Gameobject } from "../GameObject/Gameobject";
import { Vector } from "../Vector";

class Button extends Gameobject
{
    protected size_: Vector = new Vector(0, 0);
    // protected text_: string = ""; //text on the button
    // protected textSize_: number = 0; //text size
    // protected font_: string = ""; //text font
    // protected textColor_: string = ""; //text color
    // protected highlightTextColor_: string = ""; //text color when cursor is hovering above it
    protected highlighted_: boolean = false; //is the cursor hovering above the button?
    protected img_: HTMLImageElement | undefined = undefined; //button texture
    protected pressed_: number = 0; //is the button currently clicked?

    public Update(delta_time: number) 
    {}

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null) return;
    }

    public DelayedDraw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null || this.img_ === undefined) return;
        
        main_ctx.drawImage(this.img_, 320 * this.pressed_, 0, 320, this.img_.naturalHeight, this.position_.x, this.position_.y, this.size_.x, this.size_.y);

        // main_ctx.font = this.textSize_ + "px " + this.font_;
        // if (this.highlighted_) main_ctx.fillStyle = this.textColor_;
        // else main_ctx.fillStyle = this.highlightTextColor_;
        // main_ctx.fillText(this.text_, this.position_.x, this.position_.y + this.textSize_);
    }

    public Effect()
    {
        console.log("Button Effect");
    }

    public set Size(size: Vector) {this.size_ = size;}
    public get Size() {return this.size_;}
    public set Highlight(highlighted: boolean) {this.highlighted_ = highlighted;}
    public get Highlight() {return this.highlighted_;}
    public set Pressed(pressed: number) {this.pressed_ = pressed;}
    public get Pressed() {return this.pressed_;}

    // public SetPressed(pressed: number)
    // {
    //     this.pressed_ = pressed;
    // }
}

export {Button};