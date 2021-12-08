import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class Text extends Gameobject
{
    private size_: number;
    private text_: string;
    private color_: string;

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
    }

    public Update(delta_time: number) 
    {}

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
    }

    public DelayedDraw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null) return;

        //TEST
        main_ctx.fillStyle = this.color_;
        main_ctx.font =  this.size_ + 'px serif';
        main_ctx.fillText(this.text_, this.position_.x, this.position_.y + this.size_);
    }

    public set Text(text: string) {this.text_ = text;}
    public get Text() {return this.text_;}
}

export {Text};