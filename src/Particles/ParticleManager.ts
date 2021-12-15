import { Scene } from "../Scene/Scene"
import { Vector } from "../Vector";
//Particles
import { ParticleImage } from "./ParticleImage";
import { ParticleText } from "./ParticleText";

class ParticleManager
{
    private scene_: Scene;

    constructor(scene: Scene)
    {  
        this.scene_ = scene;
    }

    public Debris(position: Vector)
    {
        const colors: number[] = 
        [
            234,208,168,
            182,159,102,
            107,84,40,
            118,85,43,
            64,41,5
        ];
        for (var i = 0; i < 15; i++)
        {
            const lifespan: number = Math.floor(Math.random() * 2) / 10 + 1;
            const endScale: number = Math.floor(Math.random() * 5) / 10;
            const vx: number = Math.floor(Math.random() * 1000) - 500;
            const vy: number = Math.floor(Math.random() * 500);
            const angularVelocity: number = Math.floor(Math.random() * 500);
            const color: number = Math.floor(Math.random() * 5);
            this.scene_.Add(new ParticleImage("./White_Box_Particle.png", position,                           //required
                                              lifespan, 1,                                                    //progression
                                              new Vector(32, 32), new Vector(.3, .3), new Vector(0, 0),       //image size / scale
                                              new Vector(vx, -vy),　new Vector(0, 1000), 1,                   //velocity / damp
                                              0, angularVelocity, 1,                                          //angles
                                              colors[color*3], colors[color*3+1], colors[color*3+2], 1, 1));  //color
        }
    }

    public FadingText(position: Vector, text: string, textSize: number)
    {
        this.scene_.Add(new ParticleText(text, "serif", textSize, position,                                 //required
                                         1, 1,                                                   //progression
                                         new Vector(0, 0), new Vector(1, 1), new Vector(1, 1),                //image size / scale
                                         new Vector(0, 0), new Vector(0, 0), 1,                   //velocity / damp
                                         0, 0, 1,                                                 //angles
                                         255, 255, 255, 1, 0));                                    //colors

    }

    public RaisingText(position: Vector, text: string, textSize: number)
    {
        this.scene_.Add(new ParticleText(text, "serif", textSize, position,                                 //required
                                         1, 1,                                                   //progression
                                         new Vector(0, 0), new Vector(1, 1), new Vector(1, 1),                //image size / scale
                                         new Vector(0, -100), new Vector(0, 0), .95,                   //velocity / damp
                                         0, 0, 1,                                                 //angles
                                         240, 230, 140, 1, 0));                                     //colors
    }

    public Spark()
    {

    }
}

export {ParticleManager};