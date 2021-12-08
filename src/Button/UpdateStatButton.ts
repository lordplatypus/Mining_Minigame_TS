import { Button } from "./Button";
import { Stats } from "../Stats";
import { Vector } from "../Vector";

class UpdateStatButton extends Button
{
    private stats_: Stats;
    private statName_: string;
    private value_: number
    private minValue_: number;
    private maxValue_: number;

    constructor(stats: Stats, name: string, tag: string, ID: number, position: Vector, size: Vector, buttonText: string, textSize: number, font: string, 
                textColor: string, color: string, highlightColor: string, statName: string, value: number, minValue: number, maxValue: number)
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
        this.value_ = value;
        this.minValue_ = minValue;
        this.maxValue_ = maxValue;

        this.highlighted_ = false;
    }

    public Effect()
    {
        console.log("Update Stat Button Effect");

        var currentStatValue: number | undefined = this.stats_.GetStat(this.statName_); //get current stat value
        if (currentStatValue === undefined) return; //make sure it exists

        if (currentStatValue + this.value_ < this.minValue_ || currentStatValue + this.value_ > this.maxValue_) return; //limter

        this.stats_.SetStat(this.statName_, currentStatValue + this.value_); //set stat
    }
}

export {UpdateStatButton};