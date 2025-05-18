import { faker } from "@faker-js/faker";
import { type Match } from "../types";

let id = 0;
export const getRandomMatch = (): Match => {
  const getRandomOdds = () =>
    parseFloat(faker.finance.amount({ min: 1.05, max: 10, dec: 2 }));

  const generateCompetitorName = () =>
    faker.location.city() + " " + faker.company.buzzNoun();

  const generateRandomOverUnderData = () => {
    const minLine = 0.5;
    const maxLine = 4.5;
    const step = 0.5;
    const minOdds = 1.3;
    const maxOdds = 3.0;

    const steps = Math.floor((maxLine - minLine) / step) + 1;
    const line = +(minLine + Math.floor(Math.random() * steps) * step).toFixed(
      1
    );
    const randOdds = () =>
      +(Math.random() * (maxOdds - minOdds) + minOdds).toFixed(2);

    return [
      { id: `over-${line}`, name: "Over", odds: randOdds(), line },
      { id: `under-${line}`, name: "Under", odds: randOdds(), line },
    ];
  };

  const homeTeam = generateCompetitorName();

  let awayTeam;
  do {
    awayTeam = generateCompetitorName();
  } while (awayTeam === homeTeam);

  const startTime = new Date();
  const randomOffset = faker.number.int({ min: -70, max: -10 });
  startTime.setMinutes(startTime.getMinutes() + randomOffset);

  const matchProgress =
    randomOffset < 0 ? Math.min(100, Math.abs(randomOffset) / 1.8) : 0;

  const homeScore = Math.min(
    5,
    Math.floor(matchProgress / 20) * faker.number.int({ min: 0, max: 1 })
  );
  const awayScore = Math.min(
    5,
    Math.floor(matchProgress / 20) * faker.number.int({ min: 0, max: 1 })
  );

  const isFavorite = faker.datatype.boolean();
  let homeWin, awayWin;

  if (isFavorite) {
    homeWin = getRandomOdds() * 0.7; // Lower odds for favorite
    awayWin = getRandomOdds() * 1.3; // Higher odds for underdog
  } else {
    homeWin = getRandomOdds() * 1.3; // Higher odds for underdog
    awayWin = getRandomOdds() * 0.7; // Lower odds for favorite
  }

  const draw = getRandomOdds() * 1.2;

  // Double chance odds calculation
  const doubleChanceHomeOrDraw = parseFloat(
    ((homeWin * draw) / (homeWin + draw + 0.5)).toFixed(2)
  );
  const doubleChanceAwayOrDraw = parseFloat(
    ((awayWin * draw) / (awayWin + draw + 0.5)).toFixed(2)
  );
  const doubleChanceHomeOrAway = parseFloat(
    ((homeWin * awayWin) / (homeWin + awayWin + 0.5)).toFixed(2)
  );

  const markets = {
    "1X2": {
      selections: [
        {
          id: "1",
          name: "1",
          odds: parseFloat(homeWin.toFixed(2)),
          prevOdds: parseFloat(homeWin.toFixed(2)),
        },
        {
          id: "X",
          name: "X",
          odds: parseFloat(draw.toFixed(2)),
          prevOdds: parseFloat(draw.toFixed(2)),
        },
        {
          id: "2",
          name: "2",
          odds: parseFloat(awayWin.toFixed(2)),
          prevOdds: parseFloat(awayWin.toFixed(2)),
        },
      ],
    },
    DoubleChance: {
      selections: [
        {
          id: "1X",
          name: "1X",
          odds: doubleChanceHomeOrDraw,
          prevOdds: doubleChanceHomeOrDraw,
        },
        {
          id: "12",
          name: "12",
          odds: doubleChanceAwayOrDraw,
          prevOdds: doubleChanceAwayOrDraw,
        },
        {
          id: "X2",
          name: "X2",
          odds: doubleChanceHomeOrAway,
          prevOdds: doubleChanceHomeOrAway,
        },
      ],
    },
    TotalGoals: {
      selections: generateRandomOverUnderData(),
    },
  };

  return {
    id: `match-${id++}`,
    markets,
    competitors: {
      home: {
        name: homeTeam,
        logo: faker.image.avatarGitHub(),
      },
      away: {
        name: awayTeam,
        logo: faker.image.avatarGitHub(),
      },
    },
    startTime,
    matchProgress,
    score: {
      home: homeScore,
      away: awayScore,
    },
  };
};
