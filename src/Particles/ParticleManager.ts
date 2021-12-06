import { Particle } from "./Particle";
import { Scene } from "../Scene/Scene"
import { Vector } from "../Vector";

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
            this.scene_.Add(new Particle("./White_Box_Particle.png", position,                          //required
                                        lifespan, 1,                                                    //progression
                                        new Vector(32, 32), new Vector(.3, .3), new Vector(0, 0),       //image size / scale
                                        new Vector(vx, -vy),　new Vector(0, 1000), 1,                   //velocity / damp
                                        0, angularVelocity, 1,                                          //angles
                                        colors[color*3], colors[color*3+1], colors[color*3+2], 1, 1));  //color
        }
    }

    public Spark()
    {

    }
}

export {ParticleManager};