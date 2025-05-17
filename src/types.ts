export const MarketType = {
  "1X2": "1X2",
  DoubleChance: "DoubleChance",
  TotalGoals: "TotalGoals",
};
type MarketType = keyof typeof MarketType;

export type Selection = {
  id: string;
  name: string;
  odds: number;
  line?: number;
};

type Market = {
  selections: Selection[];
};

export type Match = {
  id: string;
  sport: "soccer";
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
  matchProgress: number; // Adding progress as percentage
  score: {
    home: number;
    away: number;
  };
  totalLine: number; // TODO

  odds: {
    "1X2": {
      home: number;
      draw: number;
      away: number;
    };
    "Double Chance": {
      homeOrDraw: number;
      awayOrDraw: number;
      homeOrAway: number;
    };
    Total: {
      over: number;
      total: number;
      under: number;
    };
  };
  // Added for animation tracking
  previousOdds: {
    "1X2": {
      home: number;
      draw: number;
      away: number;
    };
    "Double Chance": {
      homeOrDraw: number;
      awayOrDraw: number;
      homeOrAway: number;
    };
    Total: {
      over: number;
      total: number;
      under: number;
    };
  };
};
