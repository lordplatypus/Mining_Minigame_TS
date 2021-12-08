import { Button } from "./Button";
import { Vector } from "../Vector";

class ButtonManager
{
    private buttons_: Button[];
    private canvas_: HTMLCanvasElement;

    constructor()
    {
        this.buttons_ = [];

        this.canvas_ = <HTMLCanvasElement>document.getElementById("main_canvas");
    }

    public Init()
    {
        if (this.canvas_ !== null) 
        {
            this.canvas_.addEventListener("mousemove", this.MouseMovement);
            this.canvas_.addEventListener("mousedown", this.Click);
        }
    }

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null)
    {
        for (var i = 0; i < this.buttons_.length; i++)
        {
            this.buttons_[i].Draw(main_ctx, grid_ctx);
        }
    }

    public DelayedDraw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null)
    {
        for (var i = 0; i < this.buttons_.length; i++)
        {
            this.buttons_[i].DelayedDraw(main_ctx, grid_ctx);
        }
    }

    public Add(button: Button)
    {
        this.buttons_.push(button);
    }

    public Clear()
    {
        this.buttons_ = [];
        if (this.canvas_ !== null)
        {
            this.canvas_.removeEventListener("mousemove", this.MouseMovement);
            this.canvas_.removeEventListener("mousedown", this.Click);
        }
    }

    private MouseMovement = (event: MouseEvent) =>
    {
        if (this.canvas_ === null || this.canvas_ === undefined) 
        {
            console.log("Fail");
            return;
        }

        var rectangle : DOMRect = this.canvas_.getBoundingClientRect();
        var mousePosition: Vector = new Vector(event.clientX - rectangle.left, event.clientY - rectangle.top);

        for (var i = 0; i < this.buttons_.length; i++)
        {
            if (mousePosition.x >= this.buttons_[i].Position.x && mousePosition.x <= this.buttons_[i].Position.x + this.buttons_[i].Size.x && 
                mousePosition.y >= this.buttons_[i].Position.y && mousePosition.y <= this.buttons_[i].Position.y + this.buttons_[i].Size.y)
                this.buttons_[i].Highlight = true;
            else  this.buttons_[i].Highlight = false;
        }
    }

    private Click = (event: MouseEvent) =>
    {
        // if (this.canvas_ === null || this.canvas_ === undefined) 
        // {
        //     console.log("Fail");
        //     return;
        // }

        // var rectangle : DOMRect = this.canvas_.getBoundingClientRect();
        // var mousePosition: Vector = new Vector(event.clientX - rectangle.left, event.clientY - rectangle.top);

        for (var i = 0; i < this.buttons_.length; i++)
        {
            if (this.buttons_[i].Highlight) this.buttons_[i].Effect();
        }
    }
}

export {ButtonManager};