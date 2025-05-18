export type MarketType = "1X2" | "DoubleChance" | "TotalGoals";

export type Selection = {
  id: string;
  name: string;
  odds: number;
  prevOdds?: number;
  line?: number;
};

type Market = {
  selections: Selection[];
};

export type Match = {
  id: string;
  competitors: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
  markets: Record<MarketType, Market>;
  startTime: string | Date;
  matchProgress: number;
  score: {
    home: number;
    away: number;
  };
};
