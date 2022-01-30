import { Scene } from "../Scene/Scene"
import { Stats } from "../Stats";
import { Vector } from "../Vector";
import { Calculations } from "../Calculations";
//Treasure
import { TreasureList } from "./TreasureList";
import { TreasureInfo } from "./TreasureInfo";
import { Treasure } from "./Treasure";

class TreasureManager
{
    constructor(scene: Scene, stats: Stats, gridCellSize: number, mainCellSize: number, mainRows: number, mainColumns: number)
    {
        const treasureAmount: number = this.TreasureAmount(stats.GetStat("Rows"));
        const treasureToSpawn: TreasureInfo[] = this.ChooseTreasure(treasureAmount, Math.floor(stats.GetStat("Rows") / 10) + 1);
        this.SpawnTreasure(treasureToSpawn, scene, stats, gridCellSize, mainCellSize, mainRows, mainColumns);
        console.log(treasureToSpawn);
    }

    private TreasureAmount(gridRows: number): number
    {//Returns how many cells can be used for treasure
        const percentMap: number = Math.floor(Math.random() * 40 + 30) / 100; //lowest 30% | highest 70%
        return Math.floor(Math.random() * (gridRows * gridRows * percentMap));
    }

    private ChooseTreasure(treasureAmount: number, maxRarity: number): TreasureInfo[]
    {//Makes a list of treasure using the "TreasureAmount" as a limiter
        const treasureList: TreasureList = new TreasureList(); //object that holds every treasure reference - a dictonary of sorts
        const treasureToSpawn: TreasureInfo[] = []; //list that will be returned at the end
        var amountLeft: number = treasureAmount; //empty cells remaining
        while (amountLeft > 0)
        {
            const percentage: number = Math.floor(Math.random() * 1000); //decided rarity
            var rolledRarity: number = 0; //1 ~ 10
            if (percentage <= 1) rolledRarity = 10; //.1%
            else if (percentage <= 5) rolledRarity = 9; //.5%
            else if (percentage <= 10) rolledRarity = 8; //1%
            else if (percentage <= 24) rolledRarity = 7; //2.4%
            else if (percentage <= 40) rolledRarity = 6; //4%
            else if (percentage <= 80) rolledRarity = 5; //8%
            else if (percentage <= 140) rolledRarity = 4; //14%
            else if (percentage <= 180) rolledRarity = 3; //18%
            else if (percentage <= 220) rolledRarity = 2; //22%
            else rolledRarity = 1; //30%

            if (rolledRarity > maxRarity) rolledRarity = maxRarity; //if rolled rarity is higher then the max rarity then set the roll to = the max rarity
            const treasure: TreasureInfo = treasureList.GetRandomByRarity(rolledRarity); //grab a random treasure within the rarity group from the "dictionary"
            amountLeft -= treasure.POINTS.length; //reduce the num of empty cells by the size(num of cells the treasure takes up) of the treasure
            treasureToSpawn.push(treasure);
        }
        return treasureToSpawn;
    }

    private SpawnTreasure(treasureToSpawn: TreasureInfo[], scene: Scene, stats: Stats, gridCellSize: number, mainCellSize: number, mainRows: number, mainColumns: number)
    {
        const calcs: Calculations = new Calculations();
        const gridRows: number = stats.GetStat("Rows");
        var occupied: Vector[] = []; //stores positions that already have money
        for (var i = 0; i < treasureToSpawn.length; i++)
        {
            var done: boolean = false; 
            var x: number = 0;
            var y: number = 0;
            var failsafe: number = 0;
            const points: Vector[] = treasureToSpawn[i].POINTS;
            while (!done)
            {
                done = true; //if the check later succedes then break out of the while loop
                x = Math.floor(Math.random() * (gridRows)); //random x
                y = Math.floor(Math.random() * (gridRows)); //random y
                for (var j = 0; j < points.length; j++)
                {
                    if (x + points[j].x >= gridRows || y + points[j].y >= gridRows)
                    {//if the position goes out of bounds, try again
                        done = false;
                        break;
                    }
                    for (var k = 0; k < occupied.length; k++)
                    {
                        if (x + points[j].x === occupied[k].x && y + points[j].y === occupied[k].y) 
                        {//if the rand position was already used try again
                            done = false;
                            break;
                        }
                    }
                    if (!done) break;
                }

                failsafe++;
                if (failsafe > 100) done = true; //break out of the loop if something goes wrong
            }
            if (failsafe > 100) continue; //failed to find a location so this object get yeeted - avoids overlap

            var treasureIDs: number[] = []; //passed on to the Treasure gameobject - used to see if the treasure is still buried or not
            for (var j = 0; j < points.length; j++) 
            {//add all cells that are taken up by the treasure to the "occupied" array
                occupied.push(new Vector(x + points[j].x, y + points[j].y));
                treasureIDs.push(calcs.ConvertLocalToID(new Vector(x + points[j].x, y + points[j].y), gridRows, gridRows));
            }
            scene.Add(new Treasure(scene, stats, treasureToSpawn[i].NAME, "Treasure", treasureIDs, new Vector(gridCellSize*x, gridCellSize*y), 
                                   new Vector(treasureToSpawn[i].SIZE.x * gridCellSize, treasureToSpawn[i].SIZE.y * gridCellSize), 
                                   "./" + treasureToSpawn[i].NAME + ".png", treasureToSpawn[i].VALUE, gridCellSize, mainCellSize, mainRows, mainColumns));
        }
    }
}

export {TreasureManager};