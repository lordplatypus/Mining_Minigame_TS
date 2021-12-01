import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class Dirt extends Gameobject
{
    private level_: number;
    private color_: string;

    constructor(name: string, tag: string, ID: number, position: Vector, size: Vector, level: number)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);

        this.width_ = size.x;
        this.height_ = size.y;
        this.level_ = level;

        this.color_ = "#0000cc"; //TEST - change to images
    }

    public Update(delta_time: number) 
    {}

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;

        //TEST
        ctx.fillStyle = this.color_;
        ctx.fillRect(this.position_.x, this.position_.y, this.width_, this.height_);
    }

    public LowerLevel()
    {
        this.level_--;

        if (this.level_ <= 0) this.Kill();
        else if (this.level_ === 1) this.color_ = "#cc0000";
        else if (this.level_ === 2) this.color_ = "#00cc00";
        else if (this.level_ === 3) this.color_ = "#0000cc";
    }
}

export {Dirt};