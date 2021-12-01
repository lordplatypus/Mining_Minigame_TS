import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class Background extends Gameobject
{
    constructor(name: string, tag: string, ID: number, position: Vector, size: Vector)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = size.x;
        this.height_ = size.y;
    }

    public Update(delta_time: number) 
    {}

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;

        //TEST
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(this.position_.x, this.position_.y, this.width_, this.height_);
    }
}

export {Background};