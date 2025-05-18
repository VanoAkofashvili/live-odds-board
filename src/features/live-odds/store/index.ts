import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import type { Match } from "../../../types";

export type PositionData = {
  matchId: string;
  gameName: string; // 1x2, double chance, total
  marketId: string;
  outcomeName: string; // 1 x 2 , 2x 1x
  outcomeId: string; // 1, 2, x, and so on
};

type MatchesState = Record<string, Match>;

type State = {
  isLoading: boolean;
  matches: MatchesState | null;
  positions: Record<string, Omit<PositionData, "matchId">>;
};

type Action = {
  updatePosition: (position: PositionData) => void;
  removePosition: (matchId: string) => void;
  removeAllPosition: () => void;
  updateMatches: (matches: MatchesState) => void;
  setMatches: (matches: MatchesState) => void;
};

export const useOddsData = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        isLoading: true,
        matches: null,
        positions: {},
        setMatches: (matches) =>
          set((state) => {
            return {
              ...state,
              matches,
              isLoading: false,
            };
          }),
        updateMatches: (matches) =>
          set((state) => {
            const updatedMatches = { ...state.matches };
            Object.keys(matches).forEach((matchId) => {
              updatedMatches[matchId] = matches[matchId];
            });
            return {
              ...state,
              matches: updatedMatches,
            };
          }),
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
      }),
      {
        name: "positions-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ positions: state.positions }),
      }
    )
  )
);
