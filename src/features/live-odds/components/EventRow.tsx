import { memo, Fragment } from "react";
import type { Match } from "../../../types";
import { useOddsData } from "../store";
import { getMatchTimeAndHalf } from "../utils";
import Outcome from "./Outcome";

const Th = ({
  span = 1,
  label,
  className = "",
}: {
  span?: number;
  label: string;
  className?: string;
}) => <div className={`col-span-${span} min-w-20 ${className}`}>{label}</div>;

type EventRowProps = {
  match: Match;
};
const EventRow: React.FC<EventRowProps> = ({ match }) => {
  const { home, away } = match.competitors;

  const updatePosition = useOddsData((state) => state.updatePosition);
  const removePosition = useOddsData((state) => state.removePosition);
  const selectedOdds = useOddsData((state) => state.positions);

  // Betting Options
  const oneXTwo = match.markets["1X2"].selections;
  const doubleChance = match.markets["DoubleChance"].selections;
  const totalGoals = match.markets["TotalGoals"].selections;

  const matchTimeAndHalf = getMatchTimeAndHalf(
    match.startTime,
    match.matchProgress
  );

  const selectedOdd = selectedOdds[match.id];

  console.log({ totalGoals });
  return (
    <div className="bg-table-row text-black mx-auto h-full overflow-x-auto no-scrollbar">
      {/* HEADER */}
      <div className="grid grid-cols-14 gap-2 items-center text-sm border-t-2 border-b-2 border-gray-500 bg-white-200 px-4 min-w-max">
        <Th label="Time" />
        <Th label="Pair ⚽" span={3} />
        <Th label="Score" />

        {/* BETTING OPTIONS */}
        {oneXTwo.map((odd) => (
          <Th key={odd.id} label={odd.name} className="text-center" />
        ))}
        {doubleChance.map((odd) => (
          <Th key={odd.id} label={odd.name} className="text-center" />
        ))}
        {totalGoals.map((odd, i) => (
          <Fragment key={odd.id}>
            {i === 1 && <Th label="Total" className="text-center" />}
            <Th label={odd.name} className="text-center" />
          </Fragment>
        ))}
      </div>

      {/* DATA */}
      <div className="mt-2 grid grid-cols-14 gap-2 items-center px-4 min-w-max">
        <div className="col-span-1 flex items-center shrink-0">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-ping shrink-0"></div>
          <span className="text-sm whitespace-nowrap">
            {matchTimeAndHalf.matchMinutes}' <br />
            {matchTimeAndHalf.half} <br />
            {matchTimeAndHalf.formattedStartTime}
          </span>
        </div>
        <div className="col-span-3 min-w-[150px]">
          <div className="flex flex-col space-y-2">
            {[home, away].map(({ logo, name }, i) => (
              <div className="flex items-center" key={i}>
                <div className="w-5 h-5 bg-outcome-active rounded-full flex items-center justify-center mr-2">
                  <img
                    className="rounded-full w-full h-full"
                    loading="lazy"
                    src={logo}
                  />
                </div>
                <span className="text-sm max-w-50 truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 text-white">
          {[match.score.home, match.score.away].map((score, i) => (
            <div
              key={i}
              className="text-center bg-gray-800 flex items-center justify-center mb-2 w-7 h-7 rounded-full"
            >
              {score}
            </div>
          ))}
        </div>
        {oneXTwo.map((odd) => {
          const isActive = selectedOdd && selectedOdd.outcomeId === odd.id;
          return (
            <Outcome
              key={odd.id}
              isActive={isActive}
              value={odd.odds}
              prevValue={odd.prevOdds}
              onClick={() => {
                if (isActive) return removePosition(match.id);
                updatePosition({
                  matchId: match.id,
                  gameName: "1X2",
                  outcomeId: odd.id,
                  outcomeName: odd.name,
                  marketId: "1X2",
                });
              }}
            />
          );
        })}
        {doubleChance.map((odd) => {
          const isActive = selectedOdd && selectedOdd.outcomeId === odd.id;
          return (
            <Outcome
              key={odd.id}
              isActive={isActive}
              value={odd.odds}
              prevValue={odd.prevOdds}
              onClick={() => {
                if (isActive) return removePosition(match.id);
                updatePosition({
                  matchId: match.id,
                  gameName: "Double Chance",
                  outcomeId: odd.id,
                  outcomeName: odd.name,
                  marketId: "DoubleChance",
                });
              }}
            />
          );
        })}
        {totalGoals.map((odd, i) => {
          const isActive = selectedOdd && selectedOdd.outcomeId === odd.id;
          return (
            <Fragment key={odd.id}>
              {i === 1 && (
                <Outcome
                  value={odd.line!}
                  prevValue={odd.prevOdds}
                  onClick={() => {}}
                />
              )}
              <Outcome
                isActive={isActive}
                prevValue={odd.prevOdds}
                value={odd.odds}
                onClick={() => {
                  if (isActive) return removePosition(match.id);
                  updatePosition({
                    matchId: match.id,
                    gameName: "TOTAL",
                    outcomeId: odd.id,
                    outcomeName: `${odd.name}-${odd.line}`,
                    marketId: "TotalGoals",
                  });
                }}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default memo(EventRow);
