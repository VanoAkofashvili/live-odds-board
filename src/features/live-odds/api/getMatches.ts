import { transformMatches } from "../utils";

export const getMatches = () => {
  return fetch("/api/matches")
    .then((res) => res.json())
    .then((matches) => transformMatches(matches));
};
