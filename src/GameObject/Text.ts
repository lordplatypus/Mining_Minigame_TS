import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";

class Text extends Gameobject
{
    private size_: number; //Text size
    private prefix_: string; //The text string is split between prefix & suffix - Prefix normaly dosen't change
    private suffix_: string; //Suffix on the other hand changes frequently
    private font_: string; //text font
    private color_: string; //text color

    constructor(name: string, tag: string, ID: number, position: Vector, size: number, prefix: string, suffix: string, font: string, color: string)
    {
        super();
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.size_ = size;
        this.prefix_ = prefix;
        this.suffix_ = suffix;
        this.font_ = font;
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

        main_ctx.fillStyle = this.color_;
        main_ctx.font =  this.size_ + 'px ' + this.font_;
        main_ctx.fillText(this.prefix_ + this.suffix_, this.position_.x, this.position_.y + this.size_);
    }

    public set PREFIX(prefix: string) {this.prefix_ = prefix;}
    public get PREFIX(): string {return this.prefix_;}
    public set SUFFIX(suffix: string) {this.suffix_ = suffix;}
    public get SUFFIX(): string {return this.suffix_;}
}

export {Text};