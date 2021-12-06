import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class Dirt extends Gameobject
{
    private level_: number;
    private img_: HTMLImageElement;

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

        this.img_ = new Image();
        this.img_.src = "./Dirt.png";
    }

    public Update(delta_time: number) 
    {}

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;

        ctx.drawImage(this.img_, this.level_ * 320, 0, 320, this.img_.naturalHeight, 
            this.position_.x, this.position_.y, this.width_, this.height_);
    }

    public LowerLevel()
    {
        this.level_--;
        if (this.level_ <= 0) this.Kill();
    }
}

export {Dirt};