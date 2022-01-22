import { Gameobject } from "../GameObject/Gameobject";
import { Vector } from "../Vector";

class Button extends Gameobject
{
    protected size_: Vector = new Vector(0, 0);
    protected highlighted_: boolean = false; //is the cursor hovering above the button?
    protected img_: HTMLImageElement | undefined = undefined; //button texture
    protected pressed_: number = 0; //is the button currently clicked?
    protected active_: boolean = true; //ignore effect it not active

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
    }

    public Effect()
    {
        console.log("Button Effect");
    }

    public set SIZE(size: Vector) {this.size_ = size;}
    public get SIZE() {return this.size_;}
    public set HIGHLIGHT(highlighted: boolean) {this.highlighted_ = highlighted;}
    public get HIGHLIGHT() {return this.highlighted_;}
    public set PRESSED(pressed: number) {this.pressed_ = pressed;}
    public get PRESSED() {return this.pressed_;}
    public set ACTIVE(active: boolean) {this.active_ = active;}
    public get ACTIVE() {return this.active_;}

    // public SetPressed(pressed: number)
    // {
    //     this.pressed_ = pressed;
    // }
}

export {Button};