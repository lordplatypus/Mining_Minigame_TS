import { Scene } from "./Scene";
import { Game } from "../Game";
import { Calculations } from "../Calculations";
import { Vector } from "../Vector";
import { GameobjectManager } from "../GameObject/GameobjectManager";
import { Gameobject } from "../GameObject/Gameobject";
//Gameobjects
import { Text } from "../GameObject/Text";
import { FadingText } from "../GameObject/FadingText";
import { Background } from "../GameObject/Background";
import { Dirt } from "../GameObject/Dirt";
import { Player } from "../GameObject/Player";
import { Coin } from "../GameObject/Coin";
import { TurnCounter } from "../GameObject/TurnCounter";
import { RightPanel } from "../GameObject/RightPanel";
//Butons
import { ButtonManager } from "../Button/ButtonManager";
import { Transition_Button } from "../Button/Transition_Button";

class GameScene implements Scene
{
    private game_: Game;
    private calcs_: Calculations;
    public gom_: GameobjectManager;
    public bm_: ButtonManager;
    private canvas_: HTMLCanvasElement | null;

    private columns_: number; //number or columns (easier to visualize columns and rows outside Vector)
    private rows_: number; //number of rows
    private gridSize_: number; //width and height of individual boxes (perfect square)
    private canvasSize_: Vector; //width and height of the canvas

    constructor(game: Game) 
    {
        //defaults, just to initialize
        this.game_ = game;
        this.calcs_ = new Calculations();
        this.gom_ = new GameobjectManager();
        this.bm_ = new ButtonManager();
        const columns = this.game_.GetStats().GetStat("Columns");
        this.columns_ = columns !== undefined ? columns + 2 : 0;
        const rows = this.game_.GetStats().GetStat("Rows");
        this.rows_ = rows !== undefined ? rows + 2 : 0;
        this.gridSize_ = 32;
        this.canvasSize_ = new Vector(this.columns_ * this.gridSize_, this.rows_ * this.gridSize_);

        //Canvas
        this.canvas_ = <HTMLCanvasElement>document.getElementById("main_canvas");
        // this.canvas_.width = this.canvasSize_.x;
        // this.canvas_.height = this.canvasSize_.y;
    }

    public Init() 
    {
        this.bm_.Init();

        //scale box size depending on # of columns/rows and size of the browser window
        if (this.columns_ > this.rows_) this.gridSize_ = Math.floor(window.innerWidth / this.columns_);
        else this.gridSize_ = Math.floor(window.innerHeight / this.rows_);

        //set the cavas size to fit boxes
        this.canvasSize_ = new Vector(this.columns_ * this.gridSize_, this.rows_ * this.gridSize_);
        if (this.canvas_ !== null)
        {
            this.canvas_.width = this.canvasSize_.x;
            this.canvas_.height = this.canvasSize_.y;
        }

        //Set up the background
        for (var y = 2; y < this.rows_; y++)
        {
            for (var x = 0; x < this.columns_ - 2; x++)
            {
                const backgroundID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.rows_, this.columns_);
                this.Add(new Background("Background", "Background", backgroundID, new Vector(this.gridSize_*x, this.gridSize_*y), new Vector(this.gridSize_, this.gridSize_)));
            }
        }

        

        // //set up hidden money
        // var numOfTreasure: number = Math.floor(Math.random() * 4 + 1);
        // var occupied: Vector[] = []; //stores positions that already have money
        // for (var i = 0; i < numOfTreasure; i++)
        // {
        //     var done: boolean = false; 
        //     var x: number = 0;
        //     var y: number = 0;
        //     while (!done)
        //     {
        //         done = true;
        //         x = Math.floor(Math.random() * (this.columns_ - 2));
        //         y = Math.floor(Math.random() * (this.rows_ - 2)) + 2;
        //         for (var j = 0; j < occupied.length; j++)
        //         {//if the rand position was already used try again
        //             if (x === occupied[j].x && y === occupied[j].y) done = false;
        //         }
        //     }
        //     const treasureID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.rows_, this.columns_);
        //     this.Add(new Coin(this.game_.GetStats(), this, "Coin", "Coin", treasureID, new Vector(this.gridSize_*x, this.gridSize_*y), new Vector(this.gridSize_, this.gridSize_), this.gridSize_, this.rows_, this.columns_));
        //     occupied.push(new Vector(x, y));
        //     console.log(x);
        //     console.log(y);
        //     console.log(treasureID);
        // }

        // //Set up dirt
        // for (var y = 2; y < this.rows_; y++)
        // {
        //     for (var x = 0; x < this.columns_ - 2; x++)
        //     {
        //         const level: number = Math.floor(Math.random() * 5) + 1;
        //         const ID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.rows_, this.columns_);
        //         this.Add(new Dirt("Dirt", "Dirt", ID, new Vector(this.gridSize_*x, this.gridSize_*y), new Vector(this.gridSize_, this.gridSize_), level));
        //     }
        // }

        this.Treasure();
        this.Dirt();

        this.Add(new Player(this, "Player", "Player", 0, new Vector(0, 0), new Vector(this.gridSize_, this.gridSize_), this.gridSize_, this.rows_, this.columns_))
 
        this.bm_.Add(new Transition_Button(this, "Transition", "Button", 0, new Vector(this.gridSize_ * (this.columns_ - 2), (this.gridSize_ * this.rows_) - this.gridSize_), new Vector(this.gridSize_ * 2, this.gridSize_), "Return", 32,
                    "serif", "#ff0000", "#444444", "#dddddd", "Menu"));
        const maxTurns: number | undefined = this.game_.GetStats().GetStat("MaxTurns");
        this.Add(new TurnCounter(this, "Counter", "Counter", 0, new Vector(0, 0), new Vector(this.gridSize_*(this.columns_-2), this.gridSize_*2), this.gridSize_, maxTurns === undefined ? 25 : maxTurns));
        //Set up right panel
        this.Add(new RightPanel("Right", "Panel", 0, new Vector((this.columns_ - 2) * this.gridSize_, 0), new Vector(2 * this.gridSize_, this.rows_ * this.gridSize_), this.gridSize_, maxTurns === undefined ? 25 : maxTurns));
        this.Add(new Text("Text", "Text", 0, new Vector(this.gridSize_ * (this.columns_ - 2), this.gridSize_), 16, "Money: " + this.game_.GetStats().GetStat("Money"), "#ff0000"));
        // this.Add(new FadingText("Fading", "Text", 0, new Vector(0, this.gridSize_), 32, numOfTreasure + " Treasures", "#ff0000"));
    }
    
    public Update(delta_time: number) 
    {
        this.gom_.RemoveDead(); //delete dead objects
        this.gom_.Update(delta_time);
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        this.gom_.Draw(ctx);
        this.gom_.DelayedDraw(ctx);
        //this.bm_.Draw(ctx); //currently not used
        this.bm_.DelayedDraw(ctx);
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

    public TurnUpdate()
    {//Turn progrssion
        this.gom_.RemoveDead(); //delete dead objects
        this.gom_.TurnUpdate(); //update every gameobject at turn progression
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Functions for Game Logic
    ///////////////////////////////////////////////////////////////////////////////////////////////
    private Dirt()
    {
        //Set up dirt
        for (var y = 2; y < this.rows_; y++)
        {
            for (var x = 0; x < this.columns_ - 2; x++)
            {
                const level: number = Math.floor(Math.random() * (((this.columns_ - 2) / 5) * 3)) + 1;
                const ID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.rows_, this.columns_);
                this.Add(new Dirt("Dirt", "Dirt", ID, new Vector(this.gridSize_*x, this.gridSize_*y), new Vector(this.gridSize_, this.gridSize_), level));
            }
        }
    }

    private Treasure()
    {
        //every 5 columns add a potential of 5 treasure + a garentee of 2 treasure per 5 columns
        //example: 15 columns -> min treasure = 6 / max treasure = 21
        var numOfTreasure: number = Math.floor(Math.random() * (((this.columns_ - 2) / 5) * 5) + 1) + ((this.columns_ - 2) / 5) * 2;
        var occupied: Vector[] = []; //stores positions that already have money
        for (var i = 0; i < numOfTreasure; i++)
        {
            var done: boolean = false; 
            var x: number = 0;
            var y: number = 0;
            while (!done)
            {
                done = true;
                x = Math.floor(Math.random() * (this.columns_ - 2));
                y = Math.floor(Math.random() * (this.rows_ - 2)) + 2;
                for (var j = 0; j < occupied.length; j++)
                {//if the rand position was already used try again
                    if (x === occupied[j].x && y === occupied[j].y) done = false;
                }
            }
            const treasureID: number = this.calcs_.ConvertLocalToID(new Vector(x, y), this.rows_, this.columns_);
            this.Add(new Coin(this.game_.GetStats(), this, "Coin", "Coin", treasureID, new Vector(this.gridSize_*x, this.gridSize_*y), new Vector(this.gridSize_, this.gridSize_), this.gridSize_, this.rows_, this.columns_));
            occupied.push(new Vector(x, y));
            console.log(x);
            console.log(y);
            console.log(treasureID);
        }

        this.Add(new FadingText("Fading", "Text", 0, new Vector(0, this.gridSize_), 32, numOfTreasure + " Treasures", "#ff0000"));
    }
}

export {GameScene};