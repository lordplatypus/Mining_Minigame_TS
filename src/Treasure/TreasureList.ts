import { TreasureInfo } from "./TreasureInfo";
import { Vector } from "../Vector";

class TreasureList
{
    treasureList_: TreasureInfo[];

    constructor()
    {
        this.treasureList_ = 
        [
            new TreasureInfo("Bronze_Coin", 1, new Vector(2, 2), [new Vector(0, 0), new Vector(1, 0), new Vector(0, 1), new Vector(1, 1)], 1),
            new TreasureInfo("Silver_Coin", 3, new Vector(2, 2), [new Vector(0, 0), new Vector(1, 0), new Vector(0, 1), new Vector(1, 1)], 10),
            new TreasureInfo("Gold_Coin", 6, new Vector(2, 2), [new Vector(0, 0), new Vector(1, 0), new Vector(0, 1), new Vector(1, 1)], 50),
            new TreasureInfo("Stone_Tablet", 1, new Vector(2, 3), [new Vector(0, 0), new Vector(0, 1), new Vector(1, 1), new Vector(0, 2), new Vector(1, 2)], 4)
        ];
    }

    public GetTreasureByName(name: string): TreasureInfo | undefined
    {
        for (var i = 0; i < this.treasureList_.length; i++)
        {
            if (this.treasureList_[i].NAME === name) return this.treasureList_[i];
        }
        return undefined;
    }

    public GetRandomByRarity(rarity: number): TreasureInfo
    {
        const tempList: TreasureInfo[] = [];
        for (var i = 0; i < this.treasureList_.length; i++)
        {
            if (this.treasureList_[i].RARITY === rarity) tempList.push(this.treasureList_[i]);
        }
        const randomTreasure: number = Math.floor(Math.random() * tempList.length);
        return tempList[randomTreasure];
    }
}

export {TreasureList};