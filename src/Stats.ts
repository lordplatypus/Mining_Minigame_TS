class Stats
{
    private stats_: Map<string, number> = new Map<string, number>();;

    constructor()
    {
        this.stats_.set("Money", 10);
        this.stats_.set("Power", 0);
        this.stats_.set("MaxPower", 0);
        this.stats_.set("MaxTurns", 25);
    }

    public SetStat(statName: string, value: number)
    {
        this.stats_.set(statName, value);
        console.log("Set stat: " + statName + ". With value: " + value);
    }

    public GetStat(statName: string) : number | undefined
    {
        return this.stats_.get(statName);
    }
}

export { Stats }