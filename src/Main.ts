import { Game } from "./Game";

var game_: Game = new Game(); //Scene manager

var main_canvas_: HTMLCanvasElement = <HTMLCanvasElement>$("main_canvas");
var main_ctx_: CanvasRenderingContext2D | null = main_canvas_.getContext("2d");

var grid_canvas_: HTMLCanvasElement = <HTMLCanvasElement>$("grid_canvas");
var grid_ctx_: CanvasRenderingContext2D | null = grid_canvas_.getContext("2d");

Main();

function Main()
{
    game_.Update(delta_time());
    if (main_ctx_ !== null) 
    {
        main_ctx_.fillStyle = "black"; //set background color
        main_ctx_.fillRect(0, 0, main_canvas_.getBoundingClientRect().width, main_canvas_.getBoundingClientRect().height); //clear the canvas and fill it with black
    }
    game_.Draw(main_ctx_, grid_ctx_);
    var t = setTimeout(Main, 16);
}

function $(id: string)
{
    return document.getElementById(id);
}

var past = Date.now();
function delta_time()
{
    var now = Date.now(); //Grab the current time in milliseconds
    var delta_time_ = now - past; //subtract the past from now to get the time inbetween loops
    past = now; //set up the past for next iteration
    return delta_time_ / 1000.0; //convert milliseconds to seconds
}