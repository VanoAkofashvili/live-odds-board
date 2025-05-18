import { faker } from "@faker-js/faker";
import type { Match } from "../types";
import { AppConfig } from "../AppConfig";

// TODO remove
let i = 0;
const getRandomItem = (matches: Match[]) => {
  // const randomIndex = Math.floor(Math.random() * matches.length);
  const randomIndex = i++;
  return matches[randomIndex];
};

const randomAdjust = (value: number, threshold: number): number => {
  const change = Math.random() * 2 * threshold - threshold;
  const newValue = value + change;
  return parseFloat(Math.max(newValue, 1.01).toFixed(2));
};

export const getRandomMatchUpdates = ({
  matches,
  count = AppConfig.MATCHES_TO_UPDATE,
}: {
  count?: number;
  matches: Match[];
}) => {
  console.log(matches, "DBBB");
  const updates = [];
  for (let i = 0; i < count; i++) {
    // Pick random match
    const randomMatch = getRandomItem(matches);
    console.log(randomMatch, "randomMatch");

    const markets = randomMatch.markets;

    if (faker.datatype.boolean()) {
      markets["1X2"].selections = markets["1X2"].selections.map((s) => ({
        ...s,
        odds: randomAdjust(s.odds, 2.5),
      }));
    } else {
      markets["DoubleChance"].selections = markets[
        "DoubleChance"
      ].selections.map((s) => ({
        ...s,
        odds: randomAdjust(s.odds, 2.5),
      }));
    }

    updates.push({
      ...randomMatch,
      markets,
    });
  }
  i = 0; // tODO

  return updates;
};
