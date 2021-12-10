import { Button } from "./Button";
import { Scene } from "../Scene/Scene";
import { Vector } from "../Vector";

class TransitionButton extends Button
{
    private scene_: Scene;
    private transitionToSceneName_: string;

    constructor(scene: Scene, name: string, tag: string, ID: number, position: Vector, size: Vector, buttonText: string, textSize: number,
                font: string, textColor: string, highlightTextColor: string, imgPath: string, transitionToSceneName: string)
    {
        super();
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.size_ = size;
        this.text_ = buttonText;
        this.textSize_ = textSize;
        this.font_ = font;
        this.textColor_ = textColor;
        this.highlightTextColor_ = highlightTextColor;
        this.img_ = new Image();
        this.img_.src = imgPath;

        this.transitionToSceneName_ = transitionToSceneName;
    }

    public Effect()
    {
        console.log("Transition Button Effect");
        this.scene_.ChangeScene(this.transitionToSceneName_);
    }
}

export {TransitionButton};