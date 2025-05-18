import { AppConfig } from "../AppConfig";
import type { Match } from "../types";
import { getRandomMatch } from "./getRandomMatch";

export const getInitialMatches = (
  count: number = AppConfig.MATCHES_COUNT
): Match[] => {
  // const dbMatches = localStorage.getItem("matches");

  // if (!dbMatches) {
  const matches = Array.from({ length: count }).map(getRandomMatch);
  // localStorage.setItem("matches", JSON.stringify(matches));
  return matches;
  // }

  // return JSON.parse(dbMatches);
};
