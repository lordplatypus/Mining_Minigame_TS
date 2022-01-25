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
    private mainColumns_: number;
    private mainRows_: number;
    private gridCellSize_: number;
    private gridRows_: number;

    private calcs_: Calculations = new Calculations();
    private canvas_: HTMLCanvasElement | null;
    private pm_: ParticleManager;

    constructor(scene: GameScene, name: string, tag: string, ID: number, position: Vector, stats: Stats, 
                playAreaSize: Vector, gridRows: number, mainCellSize: number, mainColumns: number, mainRows: number)
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
        this.mainColumns_ = mainColumns; //num of columns of the main grid
        this.mainRows_ = mainRows; //num of rows of the main grid
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

        if (mouseX >= 0 && mouseX <= this.mainCellSize_ * (this.mainColumns_ - 2) &&
            mouseY >= this.mainCellSize_ * 2 && mouseY <= this.mainCellSize_ * (this.mainRows_ - 1))
        {//clicked within the game field
            this.pm_.Debris(new Vector(mouseX, mouseY));

            mouseY -= this.mainCellSize_ * 2;

            const localMousePosition: Vector = this.calcs_.ConvertWorldToLocal(new Vector(mouseX, mouseY), this.gridCellSize_);
            this.RemoveDirt(localMousePosition);
    
            const area: number | undefined = this.stats_.GetStat("Area");
            const power: number | undefined = this.stats_.GetStat("Power");
            //calculate the number of turns to progress
            //Area - increases turn count by Math.ceil(Math.pow(area * 2 + 1, 2) * .75)
            //Power - increases the turn count by Area * power level
            const turnsPassed: number = area === undefined || power === undefined? 1 : Math.ceil(Math.pow(area * 2 + 1, 2) * .75) * power;
            this.scene_.TurnUpdate(turnsPassed);
        }
        else
        {//clicked outside game field

        }
    }

    private RemoveDirt(localPosition: Vector)
    {
        const area: number | undefined = this.stats_.GetStat("Area");
        const power: number | undefined = this.stats_.GetStat("Power");
        if (area === undefined || power === undefined) return;

        if (this.stats_.GetStat("Area") === 0)
        {
            const ID: number = this.calcs_.ConvertLocalToID(localPosition, this.gridRows_, this.gridRows_);
            var dirt: Dirt | null = <Dirt>this.scene_.Search("Dirt", "Dirt", ID);
            if (dirt !== null) dirt.LowerLevel(power);
            return;
        }

        const a: number = area * 2 + 1; //a*a area box (EX: an area of "2" makes a 5*5 box)
        for (var y = localPosition.y - area; y <= localPosition.y + area; y++)
        {
            if (y < 0 || y > this.gridRows_ - 1) continue; //if out of bounds, continue
            const powerY: number = a % (y - (localPosition.y - area) + 1); //Determine the power rating at Y
            for (var x = localPosition.x - area; x <= localPosition.x + area; x++)
            {
                if (x < 0 || x > this.gridRows_ - 1) continue; //if out of bounds, continue
                const powerX: number = a % (x - (localPosition.x - area) + 1); //Determine the power rating at X
                
                var p: number = 0; //power
                if (powerX <= powerY) p = powerX; //Take the lowest power rating
                else p = powerY; 
                p = power - (area - p); //lower power rating = less damage delt / current power - (area level - power rating)
                if (p <= 0) p = 1; //power(damage) can't go below 1

                const ID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.gridRows_, this.gridRows_); //convert the local x, y to ID
                var dirt: Dirt | null = <Dirt>this.scene_.Search("Dirt", "Dirt", ID); //find the dirt at location "ID"
                if (dirt !== null) dirt.LowerLevel(p); //lower the level of dirt by "p"
            }
        }

        //Example: 5*5 power rating grid looks like:
        //0 0 0 0 0
        //0 1 1 1 0
        //0 1 2 1 0
        //0 1 1 1 0
        //0 0 0 0 0
    }
}

export {Player};