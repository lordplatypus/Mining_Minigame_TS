import { Scene } from "./Scene";
import { Game } from "../Game";
import { GameobjectManager } from "../GameObject/GameobjectManager";
import { Vector } from "../Vector";
import { Gameobject } from "../GameObject/Gameobject";
//Gameobjects
import { Text } from "../GameObject/Text";
import { FadingText } from "../GameObject/FadingText";
import { Background } from "../GameObject/Background";
import { Dirt } from "../GameObject/Dirt";
import { Player } from "../GameObject/Player";
import { Coin } from "../GameObject/Coin";
import { TurnCounter } from "../GameObject/TurnCounter";
//Butons
import { ButtonManager } from "../Button/ButtonManager";
import { Transition_Button } from "../Button/Transition_Button";

class GameScene implements Scene
{
    private game_: Game;
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
        this.gom_ = new GameobjectManager();
        this.bm_ = new ButtonManager();
        this.columns_ = 10;
        this.rows_ = 10;
        this.gridSize_ = 32;
        this.canvasSize_ = new Vector(this.columns_ * this.gridSize_, this.rows_ * this.gridSize_);

        //Canvas
        this.canvas_ = <HTMLCanvasElement>document.getElementById("main_canvas");
        // if (this.canvas_ !== null) 
        // {
        //     const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        //     if (isMobile)
        //     {
        //         //this.canvas_.addEventListener("touchstart", TouchStart, false);
        //         //this.canvas_.addEventListener("touchmove", TouchMove, false);
        //         this.canvas_.addEventListener("touchend", event => this.Touch(event), false);
        //         console.log("mobile");
        //     }
        //     else 
        //     {
        //         this.canvas_.addEventListener("mousedown", event => this.Click(event));
        //         console.log("not mobile");
        //     }
        // }
        this.canvas_.width = this.canvasSize_.x;
        this.canvas_.height = this.canvasSize_.y;
    }

    public Init() 
    {
        this.bm_.Init();

        //scale box size depending on # of columns/rows and size of the browser window
        if (this.columns_ > this.rows_) this.gridSize_ = Math.floor(window.innerWidth / (this.columns_ + 2));
        else this.gridSize_ = Math.floor(window.innerHeight / (this.rows_ + 2));


//TEST
var spacer: number = this.gridSize_ * 2;
//TEST


        //set the cavas size to fit boxes
        this.canvasSize_ = new Vector(this.columns_ * this.gridSize_ + spacer, this.rows_ * this.gridSize_ + spacer);
        if (this.canvas_ !== null)
        {
            this.canvas_.width = this.canvasSize_.x;
            this.canvas_.height = this.canvasSize_.y;
        }

        //Set up the background
        //var backgroundID : number = 0; //Background probably doesn't need an ID as I don't think anything will interact with it
        for (var y = 0; y < this.rows_; y++)
        {
            for (var x = 0; x < this.columns_; x++)
            {
                this.Add(new Background("Background", "Background", -1, new Vector(this.gridSize_*x, this.gridSize_*y + spacer), new Vector(this.gridSize_, this.gridSize_)));
                //backgroundID++;
            }
        }

        //set up hidden money
        var numOfTreasure: number = Math.floor(Math.random() * 4 + 1);
        var occupied: Vector[] = []; //stores positions that already have money
        for (var i = 0; i < numOfTreasure; i++)
        {
            var done: boolean = false; 
            var x: number = 0;
            var y: number = 0;
            while (!done)
            {
                done = true;
                x = Math.floor(Math.random() * this.columns_);
                y = Math.floor(Math.random() * this.rows_);
                for (var j = 0; j < occupied.length; j++)
                {//if the rand position was already used try again
                    if (x === occupied[j].x && y === occupied[j].y) done = false;
                }
            }
            this.Add(new Coin(this.game_.GetStats(), this, "Coin", "Coin", -1, new Vector(this.gridSize_*x, this.gridSize_*y + spacer), new Vector(this.gridSize_, this.gridSize_), this.gridSize_, this.rows_, this.columns_));
            occupied.push(new Vector(x, y));
            console.log(x);
            console.log(y);
        }

        this.Add(new FadingText("Fading", "Text", -1, new Vector(0, 32), 32, numOfTreasure + " Treasures", "#ffffff"));

        //Set up dirt
        var ID: number = 0;
        for (var y = 0; y < this.rows_; y++)
        {
            for (var x = 0; x < this.columns_; x++)
            {
                this.Add(new Dirt("Dirt", "Dirt", ID, new Vector(this.gridSize_*x, this.gridSize_*y + spacer), new Vector(this.gridSize_, this.gridSize_), 3));
                ID++;
            }
        }

        this.Add(new Player(this, "Player", "Player", 0, new Vector(0, 0), new Vector(this.gridSize_, this.gridSize_), this.gridSize_, this.rows_, this.columns_))
 
        this.bm_.Add(new Transition_Button(this, "Transition", "Button", 0, new Vector(this.gridSize_ * this.columns_, 0), new Vector(64, 32), "Return", 32,
                    "serif", "#ff0000", "#444444", "#dddddd", "Menu"));
        this.Add(new TurnCounter(this, "Counter", "Counter", 0, new Vector(0, 0), new Vector(this.gridSize_*this.columns_, this.gridSize_*2)));
        this.Add(new Text("Text", "Text", 0, new Vector(this.gridSize_ * this.columns_, 32), 16, "Money: " + this.game_.GetStats().GetStat("Money"), "#ffffff"));
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
    // private Click(event: MouseEvent)
    // {
    //     if (this.canvas_ === null || this.canvas_ === undefined) 
    //     {
    //         console.log("Fail");
    //         return;
    //     }

    //     var rectangle : DOMRect = this.canvas_.getBoundingClientRect();
    //     var mousePosition: Vector = new Vector(0, 0);
    //     mousePosition.x = event.clientX - rectangle.left;
    //     mousePosition.y = event.clientY - rectangle.top;

    //     var localPosition : Vector = this.ConvertWorldToLocal(mousePosition);
    //     if (localPosition === null) return;
    //     var ID : number = this.ConvertLocalToID(localPosition);
    //     if (ID === null) return;
    // }

    // private Touch(event: TouchEvent)
    // {
    //     if (this.canvas_ === null || this.canvas_ === undefined) 
    //     {
    //         console.log("Fail");
    //         return;
    //     }

    //     event.preventDefault(); //prevent other input
    //     var touch = event.changedTouches[0]; //grab touch event (touch end)
    //     var rectangle : DOMRect = this.canvas_.getBoundingClientRect();
    //     var mousePosition: Vector = new Vector(0, 0);
    //     mousePosition.x = touch.pageX - rectangle.left;
    //     mousePosition.y = touch.pageY - rectangle.top;

    //     var localPosition : Vector = this.ConvertWorldToLocal(mousePosition);
    //     if (localPosition === null) return;
    //     var ID : number = this.ConvertLocalToID(localPosition);
    //     if (ID === null) return;
    // }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Functions for Event Listeners
    ///////////////////////////////////////////////////////////////////////////////////////////////
}

export {GameScene};