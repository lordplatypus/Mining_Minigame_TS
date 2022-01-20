import { Button } from "./Button";
import { Stats } from "../Stats";
import { Vector } from "../Vector";
import { Text } from "../GameObject/Text";

class UpdateStatButton extends Button
{
    private stats_: Stats;
    private statName_: string;
    private value_: number
    private minValue_: number;
    private maxValue_: number;
    private textObj_: Text | undefined; //optional, if there is text displayed, this will give access to that text

    constructor(stats: Stats, name: string, tag: string, ID: number, position: Vector, size: Vector, 
                imgPath: string, statName: string, value: number, minValue: number, maxValue: number, textObj?: Text)
    {
        super();
        this.stats_ = stats;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.size_ = size;
        // this.text_ = buttonText;
        // this.textSize_ = textSize;
        // this.font_ = font;
        // this.textColor_ = textColor;
        // this.highlightTextColor_ = highlightTextColor;
        this.img_ = new Image();
        this.img_.src = imgPath;

        this.statName_ = statName;
        this.value_ = value;
        this.minValue_ = minValue;
        this.maxValue_ = maxValue;
        this.textObj_ = textObj;
    }

    public Effect()
    {
        console.log("Update Stat Button Effect");

        var currentStatValue: number | undefined = this.stats_.GetStat(this.statName_); //get current stat value
        if (currentStatValue === undefined) return; //make sure it exists

        const newValue: number = currentStatValue + this.value_;
        if (newValue < this.minValue_ || newValue > this.maxValue_) return; //limter
        this.stats_.SetStat(this.statName_, newValue); //set stat

        if (this.textObj_ === undefined) return;
        this.textObj_.SUFFIX = "" + newValue;
    }
}

export {UpdateStatButton};