import { Gameobject } from "./Gameobject";
import { Scene } from "../Scene/Scene";
import { Stats } from "../Stats";
import { Vector } from "../Vector";
import { Calculations } from "../Calculations";
import { Text } from "../GameObject/Text";

class Coin extends Gameobject
{
    private stats_: Stats;
    private scene_: Scene;
    private gridSize_: number;
    private rows_: number;
    private columns_: number;
    private calcs_: Calculations;
    private done_: boolean;

    constructor(stats: Stats, scene: Scene, name: string, tag: string, ID: number, position: Vector, size: Vector, gridSize: number, rows: number, columns: number)
    {
        super();
        this.stats_ = stats;
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

        this.calcs_ = new Calculations();
        this.done_ = false;
    }

    public Update(delta_time: number) 
    {}

    public TurnUpdate() 
    {
        if (this.done_) return;

        //ConvertWorldToLocal expects the "grid" to start at (0,0), thus "- (this.gridSize_ * 2)" is needed
        var localPosition : Vector = this.calcs_.ConvertWorldToLocal(new Vector(this.position_.x, this.position_.y - (this.gridSize_ * 2)), this.gridSize_);
        if (localPosition === null) return;
        var ID : number = this.calcs_.ConvertLocalToID(localPosition, this.rows_, this.columns_);
        if (ID === null) return;

        if (this.scene_.Search("Dirt", "Dirt", ID) === null && !this.done_) 
        {//if no dirt object shares the same location, then the coin is collected
            var currentMoney: number | undefined = this.stats_.GetStat("Money"); //get current money
            if (currentMoney === undefined) return; //check if the stat exists
            currentMoney++; //add money
            this.stats_.SetStat("Money", currentMoney); //set money
            var moneyText: Text = <Text>this.scene_.Search("Text", "Text", 0); //grab money display text
            if (moneyText !== null) moneyText.Text = "Money: " + currentMoney; //display money amount
            this.done_ = true; //done, don't need to update anymore
        }
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;

        //TEST
        ctx.fillStyle = "#ffff00";
        ctx.fillRect(this.position_.x, this.position_.y, this.width_, this.height_);
    }
}

export {Coin};