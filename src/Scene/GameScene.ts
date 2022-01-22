import { Scene } from "./Scene";
import { Game } from "../Game";
import { Calculations } from "../Calculations";
import { Vector } from "../Vector";
import { GameobjectManager } from "../GameObject/GameobjectManager";
import { Gameobject } from "../GameObject/Gameobject";
import { ParticleManager } from "../Particles/ParticleManager";
//Gameobjects
import { Text } from "../GameObject/Text";
import { Background } from "../GameObject/Background";
import { Dirt } from "../GameObject/Dirt";
import { Player } from "../GameObject/Player";
import { Coin } from "../GameObject/Coin";
import { TurnCounter } from "../GameObject/TurnCounter";
import { RightPanel } from "../GameObject/RightPanel";
//Butons
import { ButtonManager } from "../Button/ButtonManager";
import { TransitionButton } from "../Button/TransitionButton";
import { UpdateStatButton } from "../Button/UpdateStatButton";

class GameScene implements Scene
{
    private game_: Game;
    private calcs_: Calculations;
    public gom_: GameobjectManager;
    public bm_: ButtonManager;
    private pm_: ParticleManager;
    //Main Canvas
    private mainCanvas_: HTMLCanvasElement | null;
    private canvasSize_: number; //width and height of the canvas (perfect square)
    private mainRows_: number; //columns and rows of the main canvas (for scaling)
    private mainCellSize_: number; //width and height of a single mainGridSection
    //Grid Canvas
    private gridCanvas_: HTMLCanvasElement | null;
    //private columns_: number; //number of columns (easier to visualize columns and rows outside Vector)
    private gridRows_: number; //number of rows (columns = rows / perfect square - easy to keep seperate as )
    private gridCellSize_: number; //width and height of individual boxes (perfect square)

    constructor(game: Game) 
    {
        //defaults, just to initialize
        this.game_ = game;
        this.calcs_ = new Calculations();
        this.gom_ = new GameobjectManager();
        this.bm_ = new ButtonManager();
        this.pm_ = new ParticleManager(this);

        this.mainCanvas_ = <HTMLCanvasElement>document.getElementById("main_canvas");
        this.canvasSize_ = 0;
        this.mainRows_ = 10; //one row = 10% of the screen
        this.mainCellSize_ = 0;

        this.gridCanvas_ = <HTMLCanvasElement>document.getElementById("grid_canvas");
        // const columns = this.game_.GetStats().GetStat("Columns");
        // this.columns_ = columns !== undefined ? columns : 0;
        const rows = this.game_.GetStats().GetStat("Rows");
        this.gridRows_ = rows !== undefined ? rows : 0;
        this.gridCellSize_ = 32;
    }

    public Init() 
    {
        const rows = this.game_.GetStats().GetStat("Rows");
        this.gridRows_ = rows !== undefined ? rows : 0;

        this.bm_.Init();

        //calculate the size of a single cell in the main grid using the window size
        if (window.innerWidth <= window.innerHeight) this.mainCellSize_ = Math.floor(window.innerWidth / this.mainRows_);
        else this.mainCellSize_ = Math.floor(window.innerHeight / this.mainRows_);
        //use the single cell size and the number of rows to calculate the main canvas size
        this.canvasSize_ = this.mainRows_ * this.mainCellSize_;
        if (this.mainCanvas_ !== null)
        {
            this.mainCanvas_.width = this.canvasSize_;
            this.mainCanvas_.height = this.canvasSize_;
        }

        //the grid canvas size is fixed to 32 x the number of grid rows (gets scaled to the main canvas later)
        if (this.gridCanvas_ !== null)
        {
            this.gridCanvas_.width = this.gridCellSize_ * this.gridRows_;
            this.gridCanvas_.height = this.gridCellSize_ * this.gridRows_;
        }

        //FOR THE GRID CANVAS        
        this.Background();
        this.Treasure();
        this.Dirt();


        //PLAYER
        this.Add(new Player(this, "Player", "Player", 0, new Vector(0, 0), this.game_.GetStats(),
                            new Vector(this.mainCellSize_ * 8, this.mainCellSize_ * 8), this.gridRows_, this.mainCellSize_,this.mainRows_));
 


        //FOR THE MAIN CANVAS

        //Return Button
        this.bm_.Add(new TransitionButton(this, "Transition", "Button", 0, new Vector(this.mainCellSize_ * (this.mainRows_ - 2), (this.mainCellSize_ * this.mainRows_) - this.mainCellSize_), 
                     new Vector(this.mainCellSize_, this.mainCellSize_), "./Button_Return.png", "Menu"));

        //Area <> buttons && text
        const areaText: Text = new Text("Area_Text", "Text", 1, new Vector(this.mainCellSize_ * (this.mainRows_ - 2), this.mainCellSize_ * 3), 16, "Area: ", "" + this.game_.GetStats().GetStat("Area"), "serif", "#ff0000");
        this.Add(areaText);
        const maxArea: number | undefined = this.game_.GetStats().GetStat("MaxArea");
        this.bm_.Add(new UpdateStatButton(this.game_.GetStats(), "Stat", "Button", 0, new Vector(this.mainCellSize_ * (this.mainRows_ - 2), this.mainCellSize_ * 4), 
                     new Vector(this.mainCellSize_ / 2, this.mainCellSize_ / 2), "./Button_Red.png", "Area", -1, 0, maxArea === undefined ? 0 : maxArea, areaText));
        this.bm_.Add(new UpdateStatButton(this.game_.GetStats(), "Stat", "Button", 0, new Vector(this.mainCellSize_ * (this.mainRows_ - 1), this.mainCellSize_ * 4), 
                     new Vector(this.mainCellSize_ / 2, this.mainCellSize_ / 2), "./Button_Blue.png", "Area", 1, 0, maxArea === undefined ? 0 : maxArea, areaText));

        //Power <> buttons && text
        const powerText: Text = new Text("Power_Text", "Text", 2, new Vector(this.mainCellSize_ * (this.mainRows_ - 2), this.mainCellSize_ * 5), 16, "Power: ", "" + this.game_.GetStats().GetStat("Power"), "serif", "#ff0000");
        this.Add(powerText);
        const maxPower: number | undefined = this.game_.GetStats().GetStat("MaxPower");
        this.bm_.Add(new UpdateStatButton(this.game_.GetStats(), "Stat", "Button", 0, new Vector(this.mainCellSize_ * (this.mainRows_ - 2), this.mainCellSize_ * 6), 
                                          new Vector(this.mainCellSize_ / 2, this.mainCellSize_ / 2), "./Button_Red.png", "Power", -1, 1, maxPower === undefined ? 0 : maxPower, powerText));
        this.bm_.Add(new UpdateStatButton(this.game_.GetStats(), "Stat", "Button", 0, new Vector(this.mainCellSize_ * (this.mainRows_ - 1), this.mainCellSize_ * 6), 
                                          new Vector(this.mainCellSize_ / 2, this.mainCellSize_ / 2), "./Button_Blue.png", "Power", 1, 1, maxPower === undefined ? 0 : maxPower, powerText));

        
        const maxTurns: number | undefined = this.game_.GetStats().GetStat("MaxTurns");
        this.Add(new TurnCounter(this, "Counter", "Counter", 0, new Vector(0, 0), new Vector(this.mainCellSize_ * (this.mainRows_ - 2), this.mainCellSize_ * 2), this.mainCellSize_, maxTurns === undefined ? 25 : maxTurns));
        //Set up right panel
        this.Add(new RightPanel("Right", "Panel", 0, new Vector(this.mainCellSize_ * (this.mainRows_ - 2), 0), new Vector(this.mainCellSize_ * 2, this.mainCellSize_ * this.mainRows_), this.mainCellSize_, maxTurns === undefined ? 25 : maxTurns));
        this.Add(new Text("Text", "Text", 0, new Vector(this.mainCellSize_ * (this.mainRows_ - 2), this.mainCellSize_), 16, "Money: ", "" + this.game_.GetStats().GetStat("Money"), "serif", "#ff0000"));
    }
    
    public Update(delta_time: number) 
    {
        this.gom_.RemoveDead(); //delete dead objects
        this.gom_.Update(delta_time);
    }

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        if (this.gridCanvas_ !== null)
        {//put first so that particles show up - HOWEVER this means that this technically updates a frame later
            main_ctx?.drawImage(this.gridCanvas_, 0, 0, this.gridCanvas_?.width, this.gridCanvas_?.height,
                                0, this.mainCellSize_ * 2, this.mainCellSize_ * 8, this.mainCellSize_ * 8);
        }

        this.gom_.Draw(main_ctx, grid_ctx);
        this.gom_.DelayedDraw(main_ctx, grid_ctx);
        //this.bm_.Draw(ctx); //currently not used
        this.bm_.DelayedDraw(main_ctx, grid_ctx); 
    }

    public ChangeScene(sceneName: string)
    {
        this.game_.ChangeScene(sceneName);
    }

    public Add(gameobject: Gameobject)
    {
        this.gom_.Add(gameobject);
    }

    public Search(name: string, tag: string, ID: number)
    {
        return this.gom_.Search(name, tag, ID);
    }

    public SearchByName(name: string) : Gameobject | null
    {
        return this.gom_.SearchByName(name);
    }

    public SearchByTag(tag: string) : Gameobject | null
    {
        return this.gom_.SearchByTag(tag);
    }

    public SearchByID(ID: number) : Gameobject | null
    {
        return this.gom_.SearchByID(ID);
    }

    public End()
    {
        this.gom_.Clear(); //remove objects
        this.bm_.Clear();
    }

    public TurnUpdate(turnsPassed?: number)
    {//Turn progrssion
        if (turnsPassed === undefined) turnsPassed = 1;
        this.gom_.RemoveDead(); //delete dead objects
        this.gom_.TurnUpdate(turnsPassed); //update every gameobject at turn progression
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Functions for Game Logic
    ///////////////////////////////////////////////////////////////////////////////////////////////
    private Background()
    {
        for (var y = 0; y < this.gridRows_; y++)
        {
            for (var x = 0; x < this.gridRows_; x++)
            {
                const backgroundID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.gridRows_, this.gridRows_);
                this.Add(new Background("Background", "Background", backgroundID, new Vector(this.gridCellSize_*x, this.gridCellSize_*y), new Vector(this.gridCellSize_, this.gridCellSize_)));
            }
        }
    }

    private Treasure()
    {
        //every 5 rows add a potential of 5 treasure + a garentee of 2 treasure per 5 rows
        //example: 15 rows -> min treasure = 6 / max treasure = 21
        var numOfTreasure: number = Math.floor(Math.random() * ((this.gridRows_ / 5) * 5) + 1) + (this.gridRows_ / 5) * 2;
        var occupied: Vector[] = []; //stores positions that already have money
        for (var i = 0; i < numOfTreasure; i++)
        {
            var done: boolean = false; 
            var x: number = 0;
            var y: number = 0;
            while (!done)
            {
                done = true;
                x = Math.floor(Math.random() * (this.gridRows_));
                y = Math.floor(Math.random() * (this.gridRows_ ));
                for (var j = 0; j < occupied.length; j++)
                {//if the rand position was already used try again
                    if (x === occupied[j].x && y === occupied[j].y) done = false;
                }
            }
            const treasureID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.gridRows_, this.gridRows_);
            this.Add(new Coin(this.game_.GetStats(), this, "Coin", "Coin", treasureID, new Vector(this.gridCellSize_*x, this.gridCellSize_*y), new Vector(this.gridCellSize_, this.gridCellSize_), this.mainCellSize_, this.gridCellSize_, this.gridRows_, this.gridRows_));
            occupied.push(new Vector(x, y));
            console.log(x);
            console.log(y);
            console.log(treasureID);
        }

        //this.Add(new FadingText("Fading", "Text", 0, new Vector(0, this.gridCellSize_), 32, numOfTreasure + " Treasures", "#ff0000"));
        if (this.mainCanvas_ === null) return
        this.pm_.FadingText(new Vector(this.mainCanvas_.width / 2, this.mainCanvas_.height / 2), numOfTreasure + " Treasures", this.mainCellSize_);
    }

    private Dirt()
    {
        //Set up dirt
        for (var y = 0; y < this.gridRows_; y++)
        {
            for (var x = 0; x < this.gridRows_; x++)
            {
                const level: number = Math.floor(Math.random() * (((this.gridRows_ - 2) / 5) * 3)) + 1;
                const ID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.gridRows_, this.gridRows_);
                this.Add(new Dirt("Dirt", "Dirt", ID, new Vector(this.gridCellSize_*x, this.gridCellSize_*y), new Vector(this.gridCellSize_, this.gridCellSize_), level));
            }
        }
    }
}

export {GameScene};