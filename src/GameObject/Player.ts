import { Gameobject } from "./Gameobject";
import { GameScene } from "../Scene/GameScene";
import { Stats } from "../Stats";
import { Vector } from "../Vector";
import { Calculations } from "../Calculations";
import { Dirt } from "./Dirt";

import { ParticleManager } from "../Particles/ParticleManager";

class Player extends Gameobject
{
    private scene_: GameScene;
    private stats_: Stats;
    private mainCellSize_: number;
    private mainRows_: number;
    private gridCellSize_: number;
    private gridRows_: number;

    private calcs_: Calculations = new Calculations();
    private canvas_: HTMLCanvasElement | null;
    private pm_: ParticleManager;

    constructor(scene: GameScene, name: string, tag: string, ID: number, position: Vector, stats: Stats, 
                playAreaSize: Vector, gridRows: number, mainCellSize: number, mainRows: number)
    {
        super();
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.width_ = playAreaSize.x; //width of play area
        this.height_ = playAreaSize.y; //height of play area

        this.stats_ = stats;
        this.gridRows_ = gridRows; //num of rows (and columns) of the play area grid
        this.gridCellSize_ = this.width_ / this.gridRows_; //world size of a single cell in the play area grid
        this.mainRows_ = mainRows; //num of rows (and columns) of the main grid
        this.mainCellSize_ = mainCellSize; //world size of a single cell in the main grid

        this.canvas_ = <HTMLCanvasElement>document.getElementById("main_canvas");
        if (this.canvas_ !== null) 
        {
            this.canvas_.addEventListener("mousedown", this.Click);
            //console.log("not mobile");
        }

        this.pm_ = new ParticleManager(this.scene_); //set up particle manager
    }

    public Update(delta_time: number) 
    {
    }

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (main_ctx === null) return;
    }

    // public DelayedDraw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
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
        var mouseX: number = event.clientX - rectangle.left;
        var mouseY: number = event.clientY - rectangle.top;

        if (mouseX >= 0 && mouseX <= this.mainCellSize_ * (this.mainRows_ - 2) &&
            mouseY >= this.mainCellSize_ * 2 && mouseY <= this.mainRows_ * this.mainCellSize_)
        {//clicked within the game field
            this.pm_.Debris(new Vector(mouseX, mouseY));

            mouseY -= this.mainCellSize_ * 2;

            const ID: number = this.calcs_.ConvertWorldToID(new Vector(mouseX, mouseY), this.gridCellSize_, this.gridRows_, this.gridRows_);
    
            // var dirt: Dirt | null = <Dirt>this.scene_.Search("Dirt", "Dirt", ID);
            // if (dirt !== null) dirt.LowerLevel();
            this.RemoveDirt(ID);
    
            this.scene_.TurnUpdate();
        }
        else
        {//clicked outside game field

        }
    }

    private RemoveDirt(ID: number)
    {
        const area: number | undefined = this.stats_.GetStat("Area");
        const power: number | undefined = this.stats_.GetStat("Power");
        if (area === undefined || power === undefined) return;

        if (this.stats_.GetStat("Area") === 0)
        {
            var dirt: Dirt | null = <Dirt>this.scene_.Search("Dirt", "Dirt", ID);
            if (dirt !== null) dirt.LowerLevel(power);
            return;
        }

        ID = ID - this.gridRows_ - 1;
        for (var y = 0; y < area + 2; y++)
        {
            for (var x = 0; x < area + 2; x++)
            {
                var pow : number = 0;
                if (x <= y) pow = (area + 2) % (x + 1);
                else if (y < x) pow = (area + 2) % (y + 1);

                const maxPower: number | undefined = this.stats_.GetStat("MaxPower");
                if (maxPower !== undefined && pow > maxPower) pow = maxPower;

                var dirt: Dirt | null = <Dirt>this.scene_.Search("Dirt", "Dirt", ID);
                if (dirt !== null) dirt.LowerLevel(power);
                ID++;
            }
            ID = ID + this.gridRows_ - 3;
        }


        // var dirt: Dirt | null = <Dirt>this.scene_.Search("Dirt", "Dirt", ID);
        // if (dirt !== null) dirt.LowerLevel();
    }
}

export {Player};