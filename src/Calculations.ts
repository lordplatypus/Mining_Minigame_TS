import { Vector } from "./Vector";

class Calculations
{
    constructor()
    {
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Coordinates
    //World - canvas coordinates
    //Local - grid - columns X rows
    //ID - 0 => columns x rows - left to right, top to bottom
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public ConvertWorldToLocal(worldPosition: Vector, gridSize: number): Vector
    {
        var localPosition: Vector | null = new Vector(0, 0);

        localPosition.x = Math.floor(worldPosition.x / gridSize);
        localPosition.y = Math.floor(worldPosition.y / gridSize);

        return localPosition;
    }

    public ConvertLocalToWorld(localPosition: Vector, gridSize: number): Vector
    {
        var worldPosition: Vector = new Vector(0, 0);

        worldPosition.x = localPosition.x * gridSize;
        worldPosition.y = localPosition.y * gridSize;

        return worldPosition;
    }

    public ConvertLocalToID(localPosition: Vector, rows: number, columns: number): number
    {
        var ID: number | null = null;

        ID = (localPosition.y % rows) * columns + localPosition.x;

        return ID;
    }

    public ConvertIDToLocal(ID: number, columns: number): Vector
    {
        var localPosition = new Vector(0, 0);
        localPosition.x = ID % columns;
        localPosition.y = Math.floor(ID / columns);
        return localPosition;
    }
    
}

export {Calculations};