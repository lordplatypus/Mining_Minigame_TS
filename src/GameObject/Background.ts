import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class Background extends Gameobject
{
    private img_:HTMLImageElement;

    constructor(name: string, tag: string, ID: number, position: Vector, size: Vector)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = size.x;
        this.height_ = size.y;

        this.img_ = new Image();
        this.img_.src = "./Dirt.png"
    }

    public Update(delta_time: number) 
    {}

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (grid_ctx === null) return;

        //TEST
        // ctx.fillStyle = "#402905";
        // ctx.fillRect(this.position_.x, this.position_.y, this.width_, this.height_);

        grid_ctx.drawImage(this.img_, 0, 0, 320, this.img_.naturalHeight, 
            this.position_.x, this.position_.y, this.width_, this.height_);
    }
}

export {Background};