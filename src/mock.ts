import { faker } from "@faker-js/faker";
import { MarketType, type Match } from "./types";
const TOTAL_MATCHES = 10000;

export const generateInitialMatches = (): Match[] => {
  // Helper function to generate realistic odds
  const getRandomOdds = () =>
    parseFloat(faker.finance.amount({ min: 1.05, max: 10, dec: 2 }));

  // Generate team or player name based on sport
  const generateCompetitorName = (sport: string) => {
    switch (sport) {
      case "soccer":
        return faker.location.city() + " " + faker.company.buzzNoun();
      default:
        return faker.location.city() + " " + faker.animal.type() + "s";
    }
  };

  return Array.from({ length: TOTAL_MATCHES }, (_, index) => {
    const sport = "soccer";

    // Generate competitor names
    const homeTeam = generateCompetitorName(sport);
    let awayTeam;
    do {
      awayTeam = generateCompetitorName(sport);
    } while (awayTeam === homeTeam);

    // Random match start time with more realistic distribution
    const startTime = new Date();
    const randomOffset = faker.number.int({ min: -70, max: -10 });
    startTime.setMinutes(startTime.getMinutes() + randomOffset);

    // Generate realistic score based on sport and match progress
    let homeScore, awayScore;
    // Calculate match progress as a percentage (0-100)
    const matchProgress =
      randomOffset < 0 ? Math.min(100, Math.abs(randomOffset) / 1.8) : 0;

    switch (sport) {
      case "soccer":
        // Soccer scores tend to be lower
        homeScore = Math.min(
          5,
          Math.floor(matchProgress / 20) * faker.number.int({ min: 0, max: 1 })
        );
        awayScore = Math.min(
          5,
          Math.floor(matchProgress / 20) * faker.number.int({ min: 0, max: 1 })
        );
        break;
      default:
        homeScore = Math.floor(
          (matchProgress / 100) * faker.number.int({ min: 0, max: 30 })
        );
        awayScore = Math.floor(
          (matchProgress / 100) * faker.number.int({ min: 0, max: 30 })
        );
    }

    // Generate betting options with realistic logic
    // Favorite teams have lower odds
    const isFavorite = faker.datatype.boolean();
    let homeWin, draw, awayWin;

    if (isFavorite) {
      homeWin = getRandomOdds() * 0.7; // Lower odds for favorite
      awayWin = getRandomOdds() * 1.3; // Higher odds for underdog
    } else {
      homeWin = getRandomOdds() * 1.3; // Higher odds for underdog
      awayWin = getRandomOdds() * 0.7; // Lower odds for favorite
    }

    // Draw odds are normally higher in most sports
    draw = getRandomOdds() * 1.2;

    // Some sports like tennis don't typically have draws
    if (["tennis", "baseball", "basketball"].includes(sport)) {
      draw = getRandomOdds() * 5; // Very unlikely
    }

    // Double chance odds calculation (more realistic)
    const doubleChanceHomeOrDraw = parseFloat(
      ((homeWin * draw) / (homeWin + draw + 0.5)).toFixed(2)
    );
    const doubleChanceAwayOrDraw = parseFloat(
      ((awayWin * draw) / (awayWin + draw + 0.5)).toFixed(2)
    );
    const doubleChanceHomeOrAway = parseFloat(
      ((homeWin * awayWin) / (homeWin + awayWin + 0.5)).toFixed(2)
    );

    // Total points over/under based on sport
    let totalLine;
    switch (sport) {
      case "soccer":
        totalLine = faker.number.float({ min: 1.5, max: 4.5 }).toFixed(2);
        break;
      default:
        totalLine = faker.number.float({ min: 2.5, max: 5.5 }).toFixed(2);
    }

    const totalOver = parseFloat(
      faker.finance.amount({ min: 1.8, max: 2.2, dec: 2 })
    );
    const totalUnder = parseFloat(
      faker.finance.amount({ min: 1.8, max: 2.2, dec: 2 })
    );

    return {
      id: `match-${index}`,
      markets: {
        [MarketType["1X2"]]: {
          selections: [
            { id: "1", name: "1", odds: parseFloat(homeWin.toFixed(2)) },
            { id: "X", name: "X", odds: parseFloat(draw.toFixed(2)) },
            { id: "2", name: "2", odds: parseFloat(awayWin.toFixed(2)) },
          ],
        },
        [MarketType.DoubleChance]: {
          selections: [
            { id: "1X", name: "1X", odds: doubleChanceHomeOrDraw },
            { id: "12", name: "12", odds: doubleChanceAwayOrDraw },
            { id: "X2", name: "X2", odds: doubleChanceHomeOrAway },
          ],
        },
        [MarketType.TotalGoals]: {
          selections: [
            // TODO maybe generate this too
            { id: "over-1.5", name: "Over", odds: 1.4, line: 1.5 },
            { id: "under-1.5", name: "Under", odds: 2.8, line: 1.5 },

            { id: "over-2.5", name: "Over", odds: 1.9, line: 2.5 },
            { id: "under-2.5", name: "Under", odds: 1.9, line: 2.5 },

            { id: "over-3.5", name: "Over", odds: 2.5, line: 3.5 },
            { id: "under-3.5", name: "Under", odds: 1.5, line: 3.5 },
          ],
        },
      },
      sport,
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
      matchProgress, // Adding progress as percentage
      score: {
        home: homeScore,
        away: awayScore,
      },
      totalLine,
      odds: {
        "1X2": {
          home: parseFloat(homeWin.toFixed(2)),
          draw: parseFloat(draw.toFixed(2)),
          away: parseFloat(awayWin.toFixed(2)),
        },
        "Double Chance": {
          homeOrDraw: doubleChanceHomeOrDraw,
          awayOrDraw: doubleChanceAwayOrDraw,
          homeOrAway: doubleChanceHomeOrAway,
        },
        Total: {
          over: totalOver,
          total: totalLine,
          under: totalUnder,
        },
      },
      // Added for animation tracking
      previousOdds: {
        "1X2": {
          home: parseFloat(homeWin.toFixed(2)),
          draw: parseFloat(draw.toFixed(2)),
          away: parseFloat(awayWin.toFixed(2)),
        },
        "Double Chance": {
          homeOrDraw: doubleChanceHomeOrDraw,
          awayOrDraw: doubleChanceAwayOrDraw,
          homeOrAway: doubleChanceHomeOrAway,
        },
        Total: {
          over: totalOver,
          total: totalLine,
          under: totalUnder,
        },
      },
    };
  });
};
