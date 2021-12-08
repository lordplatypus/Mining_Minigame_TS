import { Button } from "./Button";
import { Stats } from "../Stats";
import { Vector } from "../Vector";

class BuyButton extends Button
{
    private stats_: Stats;
    private statName_: string;
    private cost_: number;
    private value_: number

    constructor(stats: Stats, name: string, tag: string, ID: number, position: Vector, size: Vector, buttonText: string, textSize: number, 
                font: string, textColor: string, color: string, highlightColor: string, statName: string, value: number, cost: number)
    {
        super();
        this.stats_ = stats;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.size_ = size;
        this.text_ = buttonText;
        this.textSize_ = textSize;
        this.font_ = font;
        this.textColor_ = textColor;
        this.color_ = color;
        this.highlightColor_ = highlightColor;

        this.statName_ = statName;
        this.cost_ = cost;
        this.value_ = value;

        this.highlighted_ = false;
    }

    public Effect()
    {
        console.log("Buy Button Effect");

        var currentStatValue: number | undefined = this.stats_.GetStat(this.statName_); //get current stat value
        if (currentStatValue === undefined) return; //make sure it exists

        var currentMoney: number | undefined = this.stats_.GetStat("Money"); //get current money
        if (currentMoney === undefined || currentMoney < this.cost_ * this.value_) return; //return if undefined or not enough to buy upgrade
        else currentMoney -= this.cost_ * this.value_; //subtract total cost from money

        this.stats_.SetStat(this.statName_, currentStatValue + this.value_); //set stat
        this.stats_.SetStat("Money", currentMoney); //set money
        console.log("Bought");
    }
}

export {BuyButton};