import { Gameobject } from "./Gameobject";
import { Scene } from "../Scene/Scene";
import { Vector } from "../Vector";

class TurnCounter extends Gameobject
{
    private scene_: Scene;

    private maxTurns: number;
    private shrink: number;

    constructor(scene: Scene, name: string, tag: string, ID: number, position: Vector, size: Vector)
    {
        super();
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = size.x;
        this.height_ = size.y;

        this.maxTurns = 25;
        this.shrink = this.width_ / this.maxTurns;
    }

    public Update(delta_time: number) 
    {}

    public TurnUpdate() 
    {
        this.width_ -= this.shrink;
        if (this.width_ <= 0)
        {
            var player: Gameobject | null = this.scene_.Search("Player", "Player", 0);
            if (player !== null) player.Kill();
            console.log(player);
        }
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
    }

    public DelayedDraw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;

        //TEST
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(this.position_.x, this.position_.y, this.width_, this.height_);
    }
}

export {TurnCounter};