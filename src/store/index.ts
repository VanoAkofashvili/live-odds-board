import { devtools } from "zustand/middleware";
import { create } from "zustand";

type UpdateOddDataTODO = {
  matchId: string;
  oddId: string;
};

type State = {
  odds: Record<string, any>;
};

type Action = {
  updateOdd: (odd: UpdateOddDataTODO) => void;
};

export const useOdds = create<State & Action>()(
  devtools((set) => ({
    odds: {},
    updateOdd: ({ matchId, ...oddData }) =>
      set((state) => {
        return {
          ...state,
          odds: {
            ...state.odds,
            [matchId]: oddData,
          },
        };
      }),
  }))
);
