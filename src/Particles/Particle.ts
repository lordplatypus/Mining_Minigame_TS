import { Gameobject } from "../GameObject/Gameobject";
import { Vector } from "../Vector";

class Particle extends Gameobject
{
    private img_: HTMLImageElement;
    private lifespan_: number; //how long the particle will last(パーティクルの寿命)
    private age_: number; //current age of particle(パーティクルの歳)
    private progressSpeed_: number;
    private scale_: Vector; //particle scale(拡大率)
    private startScale_: Vector; //particle starting scale(開始の拡大率)
    private endScale_: Vector; //particle ending scale(終了の拡大率)
    private velocity_: Vector;
    private force_: Vector;
    private damp_: number; //dampen the particles velocity(速度のブレーキ)
    private angle_: number; //angle(角度)
    private angularVelocity_: number; //angle velocity(向きの速度)
    private angularDamp_: number; //angle damp(角度の速度のブレーキ)
    private red_: number; //red color(赤)
    private green_: number; //green color(緑)
    private blue_: number; //blue(青)
    private alpha_: number; //alpha(アルファ)
    private startAlpha_: number; //particles starting alpha(開始のアルファ)
    private endAlpha_: number; //particles ending alpha(終了のアルファ)

    //TEST
    private tempCanvas_: HTMLCanvasElement | null;
    private tctx_: CanvasRenderingContext2D | null;

    constructor(imgSrc: string, position: Vector, 
                lifespan?: number, progressSpeed?: number,
                size?: Vector, startScale?: Vector, endScale?: Vector,
                velocity?: Vector, force?: Vector, damp?: number,
                angle?: number, angularVelocity?: number, angularDamp?: number,
                red?: number, green?: number, blue?: number, startAlpha?: number, endAlpha?: number)
                
    {
        super();
        this.img_ = new Image();
        this.img_.src = imgSrc;
        this.position_ = position;
        this.lifespan_ = lifespan === undefined? 1 : lifespan;
        this.age_ = 0;
        this.progressSpeed_ = progressSpeed === undefined? 1 : progressSpeed;
        this.width_ = size === undefined? this.img_.naturalWidth : size.x;
        this.height_ = size === undefined? this.img_.naturalHeight : size?.y;
        this.scale_ = startScale === undefined? new Vector(1, 1) : startScale;
        this.startScale_ = startScale === undefined? new Vector(1, 1) : startScale;
        this.endScale_ = endScale === undefined? new Vector(1, 1) : endScale;
        this.velocity_ = velocity === undefined? new Vector(0, 0) : velocity;
        this.force_ = force === undefined? new Vector(0, 0) : force;
        this.damp_ = damp === undefined? 1 : damp; 
        this.angle_ = angle === undefined? 0 : angle;
        this.angularVelocity_ = angularVelocity === undefined? 0 : angularVelocity;
        this.angularDamp_ = angularDamp === undefined? 1 : angularDamp;
        this.red_ = red === undefined? 255 : red;
        this.green_ = green === undefined? 255 : green;
        this.blue_ = blue === undefined? 255 : blue ;
        this.alpha_ = startAlpha === undefined? 1 : startAlpha;
        this.startAlpha_ = startAlpha === undefined? 1 : startAlpha;
        this.endAlpha_ = endAlpha === undefined? 1 : endAlpha;

        //TEST
        this.tempCanvas_ = document.createElement("canvas");
        this.tempCanvas_.id = "_" + this.velocity_.x;
        this.tempCanvas_.width = this.width_ * this.scale_.x;
        this.tempCanvas_.height = this.height_ * this.scale_.y;
        if (this.tempCanvas_ !== null) this.tctx_ = this.tempCanvas_.getContext("2d");
        else this.tctx_ = null;
    }

    public Update(delta_time: number) 
    {
        this.age_ += delta_time;

        if (this.age_ >= this.lifespan_)
        {
            this.Kill();
            return;
        }
    
        const progressRate = (this.age_ / this.lifespan_) * this.progressSpeed_;
        this.scale_ = this.LerpVector(this.startScale_, this.endScale_, progressRate);
    
        var vx: number = this.velocity_.x + this.force_.x * delta_time;
        var vy: number = this.velocity_.y + this.force_.y * delta_time;
    
        vx *= Math.pow(this.damp_, delta_time * 60);
        vy *= Math.pow(this.damp_, delta_time * 60);
        this.velocity_ = new Vector(vx, vy);
    
        const x: number = this.position_.x + this.velocity_.x * delta_time;
        const y: number = this.position_.y + this.velocity_.y * delta_time;
        this.position_ = new Vector(x, y);
    
        //angularVelocity *= angularDamp;
        this.angle_ += this.angularVelocity_ * delta_time;
    
        this.alpha_ = this.LerpNumber(this.startAlpha_, this.endAlpha_, progressRate);
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
    }

    public DelayedDraw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null || this.tctx_ === null || this.tempCanvas_ === null) return;

        //this.tctx_.save();
        //tctx.scale(this.scale_.x, this.scale_.y);
        //this.tctx_.fillStyle = "rgba(234, 208, 168, 1)";
        this.tctx_.fillStyle = "rgba(" + this.red_ + ", " + this.green_ + ", " + this.blue_ + ", " + this.alpha_ + ")";
        this.tctx_.fillRect(0, 0, this.width_, this.height_);
        this.tctx_.globalCompositeOperation = "destination-in";
        this.tctx_.drawImage(this.img_, 0, 0, this.img_.naturalWidth, this.img_.naturalHeight, 0, 0, this.width_, this.height_);
        //this.tctx_.restore();

        ctx.save();
        ctx.translate(this.position_.x + (this.width_ * this.scale_.x) / 2, this.position_.y + (this.height_ * this.scale_.y) / 2);
        ctx.rotate(this.angle_ * Math.PI / 180);
        ctx.translate(-(this.position_.x + (this.width_ * this.scale_.x) / 2), -(this.position_.y + (this.height_ * this.scale_.y) / 2));
        ctx.drawImage(this.tempCanvas_, 0, 0, this.tempCanvas_.width, this.tempCanvas_.height, this.position_.x, this.position_.y, this.width_ * this.scale_.x, this.height_ * this.scale_.x);
        ctx.restore();
    }

    public Deconstructor()
    {
        // this.tempCanvas_?.remove(); //Not needed? since tempcanvas wasn't added to any parent it should go out of scope when this is Killed?
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
}

export {Particle};