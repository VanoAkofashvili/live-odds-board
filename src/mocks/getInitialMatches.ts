import { AppConfig } from "../AppConfig";
import type { Match } from "../types";
import { getRandomMatch } from "./getRandomMatch";

export const getInitialMatches = (
  count: number = AppConfig.MATCHES_COUNT
): Match[] => {
  return Array.from({ length: count }).map(getRandomMatch);
};
