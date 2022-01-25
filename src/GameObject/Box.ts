import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class Box extends Gameobject
{
    private color_: string;
    
    constructor(name: string, tag: string, ID: number, position: Vector, size: Vector, color?: string)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = size.x;
        this.height_ = size.y;
        this.color_ = color === undefined? "#ffffff" : color;
    }

    public Update(delta_time: number) 
    {}

    public TurnUpdate(turnsPassed: number) 
    {}

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null) return;

        main_ctx.fillStyle = this.color_;
        main_ctx.fillRect(this.position_.x, this.position_.y, this.width_, this.height_);
    }
}

export {Box};