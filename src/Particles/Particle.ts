import { Gameobject } from "../GameObject/Gameobject";
import { Vector } from "../Vector";

class Particle extends Gameobject
{
    //protected img_: HTMLImageElement;
    protected lifespan_: number = 0; //how long the particle will last(パーティクルの寿命)
    protected age_: number = 0; //current age of particle(パーティクルの歳)
    protected progressSpeed_: number = 0;
    protected progressRate_: number = 0;
    protected scale_: Vector = new Vector(0, 0); //particle scale(拡大率)
    protected startScale_: Vector = new Vector(0, 0); //particle starting scale(開始の拡大率)
    protected endScale_: Vector = new Vector(0, 0); //particle ending scale(終了の拡大率)
    protected velocity_: Vector = new Vector(0, 0);
    protected force_: Vector = new Vector(0, 0);
    protected damp_: number = 0; //dampen the particles velocity(速度のブレーキ)
    protected angle_: number = 0; //angle(角度)
    protected rad_: number = 0 //radians
    protected translate_: number = 0; //translate the canvas so that it can be rotated (remember to translate back after rotating)
    protected angularVelocity_: number = 0; //angle velocity(向きの速度)
    protected angularDamp_: number = 0; //angle damp(角度の速度のブレーキ)
    protected red_: number = 0; //red color(赤)
    protected green_: number = 0; //green color(緑)
    protected blue_: number = 0; //blue(青)
    protected alpha_: number = 0; //alpha(アルファ)
    protected startAlpha_: number = 0; //particles starting alpha(開始のアルファ)
    protected endAlpha_: number = 0; //particles ending alpha(終了のアルファ)

    public Update(delta_time: number) 
    {
        this.UpdateAge(delta_time);
        this.UpdateProgressRate();
        this.UpdateScale();
        this.UpdateVelocity(delta_time);
        this.UpdatePosition(delta_time);
        this.UpdateAngle(delta_time);
        this.UpdateAlpha();
    }

    public UpdateAge(delta_time: number)
    {
        this.age_ += delta_time;
        if (this.age_ >= this.lifespan_) this.Kill();
    }

    public UpdateProgressRate()
    {
        this.progressRate_ = (this.age_ / this.lifespan_) * this.progressSpeed_;
    }

    public UpdateScale()
    {
        this.scale_ = this.LerpVector(this.startScale_, this.endScale_, this.progressRate_);
    }

    public UpdateVelocity(delta_time: number)
    {
        var vx: number = this.velocity_.x + this.force_.x * delta_time;
        var vy: number = this.velocity_.y + this.force_.y * delta_time;
    
        vx *= Math.pow(this.damp_, delta_time * 60);
        vy *= Math.pow(this.damp_, delta_time * 60);

        this.velocity_ = new Vector(vx, vy);
    }

    public UpdatePosition(delta_time: number)
    {
        const x: number = this.position_.x + this.velocity_.x * delta_time;
        const y: number = this.position_.y + this.velocity_.y * delta_time;
        this.position_ = new Vector(x, y);
    }

    public UpdateAngle(delta_time: number)
    {
        //angularVelocity *= angularDamp;
        this.angle_ += this.angularVelocity_ * delta_time;
        this.rad_ = this.angle_ * Math.PI / 180;
        this.translate_ = this.position_.x + (this.width_ * this.scale_.x) / 2, this.position_.y + (this.height_ * this.scale_.y) / 2;
    }

    public UpdateAlpha()
    {
        this.alpha_ = this.LerpNumber(this.startAlpha_, this.endAlpha_, this.progressRate_);
    }

    public LerpNumber(a: number, b: number, t: number) : number
    {
        return a + (b - a) * t;
    } 

    public LerpVector(a: Vector, b: Vector, t: number) : Vector
    {
        const x = (1 - t) * a.x + t * b.x;
        const y = (1 - t) * a.y + t * b.y;
        return new Vector(x, y);
    }

    public Deconstructor()
    {
        // this.tempCanvas_?.remove(); //Not needed? since tempcanvas wasn't added to any parent it should go out of scope when this is Killed?
    }
}

export {Particle};