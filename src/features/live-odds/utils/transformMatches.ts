import type { Match } from "../../../types";

/**
 * Transforms matches array into the map where key is the matchId and the value is the match itself
 * so the lookup using match id is O(1)
 */
export const transformMatches = (matches: Match[]): Record<string, Match> => {
  const matchesObject: Record<string, Match> = {};

  matches.forEach((match) => {
    matchesObject[match.id] = match;
  });

  return matchesObject;
};
