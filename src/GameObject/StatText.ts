import { Gameobject } from "./Gameobject";
import { Vector } from "../Vector";
import { Scene } from "../Scene/Scene";
import { Stats } from "../Stats";

class StatText extends Gameobject
{
    private stats_: Stats;
    private scene_: Scene;
    private size_: number;
    private text_: string;
    private color_: string;
    private font_: string;
    private statName_: string;

    constructor(stats: Stats, scene: Scene, name: string, tag: string, ID: number, position: Vector, size: number, text: string, color: string, font: string, statName: string)
    {
        super();
        this.stats_ = stats;
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.size_ = size;
        this.text_ = text;
        this.color_ = color;
        this.font_ = font;
        this.statName_ = statName;
    }

    public Update(delta_time: number) 
    {}

    public TurnUpdate()
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
        main_ctx.font =  this.size_ + 'px ' +  this.font_;
        main_ctx.fillText(this.text_, this.position_.x, this.position_.y + this.size_);
    }

    public set Text(text: string) {this.text_ = text;}
    public get Text() {return this.text_;}
}

export {StatText};