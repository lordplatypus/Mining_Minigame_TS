import { Vector } from "../Vector";

class TreasureInfo
{
    private name_: string; //treasure name, used later to create the actual object
    private rarity_: number; //how rare is the treasure, rarer treasure appear less frequent and only in higher levels
    private size_: Vector; //width and height of the treasure (in measurments of cells)
    private points_: Vector[]; //location of each cell (for irregular shapes and for spawn logic)
    private value_: number; //amount of money rewarded from uncovering

    constructor(name:string, rarity: number, size: Vector, points: Vector[], value: number)
    {
        this.name_ = name;
        this.rarity_ = rarity;
        this.size_ = size;
        this.points_ = points;
        this.value_ = value;
    }

    set NAME(name: string) {this.name_ = name;}
    get NAME(): string {return this.name_;}
    set RARITY(rarity: number) {this.rarity_ = rarity;}
    get RARITY(): number {return this.rarity_;}
    set SIZE(size: Vector) {this.size_ = size;}
    get SIZE(): Vector {return this.size_;}
    set POINTS(points: Vector[]) {this.points_ = points;}
    get POINTS(): Vector[] {return this.points_;}
    set VALUE(value: number) {this.value_ = value;}
    get VALUE(): number {return this.value_;}
}

export {TreasureInfo};