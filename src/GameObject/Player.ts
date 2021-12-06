import { Gameobject } from "./Gameobject";
import { GameScene } from "../Scene/GameScene";
import { Vector } from "../Vector";
import { Calculations } from "../Calculations";
import { Dirt } from "./Dirt";

import { ParticleManager } from "../Particles/ParticleManager";

class Player extends Gameobject
{
    private scene_: GameScene;
    private gridSize_: number;
    private rows_: number;
    private columns_: number;

    private calcs_: Calculations = new Calculations();

    private canvas_: HTMLCanvasElement | null;

    private pm_: ParticleManager;

    constructor(scene: GameScene, name: string, tag: string, ID: number, position: Vector, size: Vector, gridSize: number, rows: number, columns: number)
    {
        super();
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = size.x;
        this.height_ = size.y;

        this.gridSize_ = gridSize;
        this.rows_ = rows;
        this.columns_ = columns;

        this.canvas_ = <HTMLCanvasElement>document.getElementById("main_canvas");
        if (this.canvas_ !== null) 
        {
            this.canvas_.addEventListener("mousedown", this.Click);
            //console.log("not mobile");
        }

        //TEST
        this.pm_ = new ParticleManager(this.scene_);
    }

    public Update(delta_time: number) 
    {
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
    }

    // public DelayedDraw(ctx: CanvasRenderingContext2D | null) 
    // {
    //     if (ctx === null) return;
    // }

    public Deconstructor() 
    {
        if (this.canvas_ !== null) this.canvas_.removeEventListener("mousedown", this.Click);
    }

    private Click = (event: MouseEvent) =>
    {
        if (this.canvas_ === null || this.canvas_ === undefined) 
        {
            console.log("Fail");
            return;
        }

        var rectangle : DOMRect = this.canvas_.getBoundingClientRect();
        var mousePosition: Vector = new Vector(0, 0);
        mousePosition.x = event.clientX - rectangle.left;
        mousePosition.y = event.clientY - rectangle.top;

        if (mousePosition.x >= 0 && mousePosition.x <= this.gridSize_ * (this.columns_ - 2) &&
            mousePosition.y >= this.gridSize_ * 2 && mousePosition.y <= this.gridSize_ * this.rows_)
        {//clicked within the game field
            var localPosition : Vector = this.calcs_.ConvertWorldToLocal(mousePosition, this.gridSize_);
            if (localPosition === null) return;
            var ID : number = this.calcs_.ConvertLocalToID(localPosition, this.rows_, this.columns_);
            if (ID === null) return;
    
            var dirt: Dirt | null = <Dirt>this.scene_.Search("Dirt", "Dirt", ID);
            if (dirt !== null) dirt.LowerLevel();
    
            this.scene_.TurnUpdate();
            this.pm_.Debris(mousePosition);
        }
        else
        {//clicked outside game field

        }
    }
}

export {Player};