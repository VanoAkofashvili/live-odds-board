import { devtools } from "zustand/middleware";
import { create } from "zustand";

type PositionData = {
  matchId: string;
  participants: { name: string }[];
  gameName: string; // 1x2, double chance, total -- category
  outcomeOdds: number;
  outcomeName: string; // 1, x, 2 and so on
  outcomeId: string;
};

type State = {
  positions: Record<string, Omit<PositionData, "matchId">>;
};

type Action = {
  updatePosition: (position: PositionData) => void;
  removePosition: (matchId: string) => void;
  removeAllPosition: () => void;
};

export const usePositions = create<State & Action>()(
  devtools((set) => ({
    positions: {},
    removeAllPosition: () =>
      set((state) => {
        return {
          ...state,
          positions: {},
        };
      }),
    removePosition: (matchId) =>
      set((state) => {
        const newPositions = { ...state.positions };
        delete newPositions[matchId];

        return {
          ...state,
          positions: newPositions,
        };
      }),
    updatePosition: ({ matchId, ...oddData }) =>
      set((state) => {
        return {
          ...state,
          positions: {
            ...state.positions,
            [matchId]: oddData,
          },
        };
      }),
  }))
);
