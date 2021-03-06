class Stats
{
    private stats_: Map<string, number> = new Map<string, number>();;

    constructor()
    {
        //Settings - can be changed by the player at will
        this.stats_.set("Power", 1); //tool power - higher # = more dirt removed in one turn
        this.stats_.set("Area", 0); //tool effect area - higher # = dirt removed in area + turns taken increased
        

        //Upgrades - things the player collects or buys
        this.stats_.set("Money", 100); //player money
        this.stats_.set("MaxPower", 2); //max tool power the player can select
        this.stats_.set("MaxArea", 1); //max tool area the player can select
        this.stats_.set("MaxTurns", 25); //how many turns untill the round ends
        this.stats_.set("Rows", 5); //# of columns in the dirt grid - every 5 = 2 more base treasure && 3 more dirt layer possible
        // this.stats_.set("Columns", 5); //# of columns in the dirt grid
        // this.stats_.set("MaxRows", 5); //max rows in the dirt grid
        // this.stats_.set("MaxColumns", 5); //max columns in the dirt grid
        this.stats_.set("Luck", 0); //chance of getting better treasure
    }

    public SetStat(statName: string, value: number)
    {
        this.stats_.set(statName, value);
        console.log("Set stat: " + statName + ". With value: " + value);
    }

    public GetStat(statName: string) : number
    {
        var stat: number | undefined = this.stats_.get(statName);
        if (stat === undefined) return -1;
        else return stat; 
    }
}

export { Stats }