import { useEffect } from "react";
import { useOddsData } from "./features/live-odds/store";
import { getRandomMatchUpdates } from "./mocks/getRandomMatchUpdates";

export const useMockWs = ({ ms = 1000 }: { ms?: number }) => {
  const updateMatches = useOddsData((state) => state.updateMatches);

  const currentMatches = useOddsData((state) => state.matches);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomUpdates = getRandomMatchUpdates({
        matches: currentMatches,
        count: 50,
      });

      updateMatches(randomUpdates);
    }, ms); // every second

    return () => clearInterval(interval);
  }, [ms]);
};
