import { Scene } from "./Scene";
import { Game } from "../Game";
import { GameobjectManager } from "../GameObject/GameobjectManager";
import { Vector } from "../Vector";
import { Gameobject } from "../GameObject/Gameobject";
//Butons
import { ButtonManager } from "../Button/ButtonManager";
import { TransitionButton } from "../Button/TransitionButton";
//TEST
import { MoneyPanel } from "../GameObject/MoneyPanel";

class MenuScene implements Scene
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
        this.columns_ = 9;
        this.rows_ = 9;
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
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //SCALING
        ////////////////////////////////////////////////////////////////////////////////////////////////////
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //BUTTON SETUP
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        this.bm_.Init();
        this.bm_.Add(new TransitionButton(this, "Transition", "Button", 0, new Vector(this.gridSize_ * 4, this.gridSize_ * 3), new Vector(this.gridSize_, this.gridSize_), "./Button_Pickaxe.png", "LevelSelect"));
        this.bm_.Add(new TransitionButton(this, "Transition", "Button", 1, new Vector(this.gridSize_ * 4, this.gridSize_ * 5), new Vector(this.gridSize_, this.gridSize_), "./Button_Coin.png", "Shop"));
    
        //TEST
        this.Add(new MoneyPanel(this, this.game_.GetStats(), "MoneyPanel", "MoneyPanel", 0, new Vector(0, 0), this.gridSize_));
    }
    
    public Update(delta_time: number) 
    {
        this.gom_.Update(delta_time);
    }

    public Draw(main_ctx: CanvasRenderingContext2D | null, grid_ctx: CanvasRenderingContext2D | null) 
    {
        this.gom_.Draw(main_ctx, grid_ctx);
        this.gom_.DelayedDraw(main_ctx, grid_ctx);
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
        this.bm_.Clear(); //remove buttons
    }

    // public TurnUpdate()
    // {//Turn progrssion
    //     // this.gom_.RemoveDead(); //delete dead objects
    //     // this.gom_.TurnUpdate(); //update every gameobject at turn progression
    // }
}

export {MenuScene};