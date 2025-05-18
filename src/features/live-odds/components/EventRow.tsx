import { Fragment } from "react/jsx-runtime";
import { useOddsData } from "../store";
import type { Match } from "../../../types";
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
}) => <div className={`col-span-${span} ${className}`}>{label}</div>;

type EventRowProps = {
  match: Match;
};
const EventRow: React.FC<EventRowProps> = ({ match }) => {
  const { home, away } = match.competitors;

  const updatePosition = useOddsData((state) => state.updatePosition);
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

  return (
    <div className="bg-table-row text-black  mx-auto overflow-x-auto">
      {/* HEADER */}
      <div className="grid grid-cols-14 gap-2 items-center text-sm border-t-2 border-b-2 border-gray-500 bg-white-200 px-4">
        <Th label="Time" />
        <Th label="Pair" span={3} />
        <Th label="Score" />

        {/* BETTING OPTIONS */}
        {oneXTwo.map((odd) => (
          <Th key={odd.id} label={odd.name} className="text-center" />
        ))}
        {doubleChance.map((odd) => (
          <Th key={odd.id} label={odd.name} className="text-center" />
        ))}
        {totalGoals.slice(0, 2).map((odd, i) => {
          return (
            <Fragment key={odd.id}>
              {i === 1 && <Th label={odd.name} className="text-center" />}
              <Th label={odd.name} className="text-center" />
            </Fragment>
          );
        })}
      </div>
      {/* DATA */}
      <div className="mt-2 grid grid-cols-14 gap-2 items-center px-4 ">
        {/* Match time and pairs */}
        <div className="col-span-1 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full shrink-0 mr-1 animate-ping"></div>
          <span className="text-sm">
            {matchTimeAndHalf.matchMinutes} <br />
            {matchTimeAndHalf.half} <br />
            {matchTimeAndHalf.formattedStartTime}
          </span>
        </div>

        <div className="col-span-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                <img className="rounded-full" loading="lazy" src={home.logo} />
              </div>
              <span className="text-sm">{home.name}</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center mr-2">
                <img className="rounded-full" loading="lazy" src={away.logo} />
              </div>
              <span className="text-sm">{away.name}</span>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="col-span-1 text-white">
          <div className="text-center bg-gray-800 rounded-xl w-6 mb-2">
            {match.score.home}
          </div>
          <div className="text-center bg-gray-800 rounded-xl w-6">
            {match.score.away}
          </div>
        </div>

        {oneXTwo.map((odd) => (
          <Outcome
            isActive={selectedOdd && selectedOdd.outcomeId === odd.id}
            value={odd.odds}
            prevValue={odd.prevOdds}
            onClick={() => {
              updatePosition({
                matchId: match.id,
                gameName: "1X2",
                outcomeId: odd.id,
                outcomeName: odd.name,
                marketId: "1X2",
                // outcomeOdds: odd.odds,
                // participants: [{ name: home.name }, { name: away.name }],
              });
            }}
          />
        ))}
        {doubleChance.map((odd) => (
          <Outcome
            isActive={selectedOdd && selectedOdd.outcomeId === odd.id}
            value={odd.odds}
            prevValue={odd.prevOdds}
            onClick={() => {
              updatePosition({
                matchId: match.id,
                gameName: "Double Chance",
                outcomeId: odd.id,
                outcomeName: odd.name,
                marketId: "DoubleChance",
              });
            }}
          />
        ))}
        {/* TODO: remove slice */}
        {totalGoals.slice(0, 2).map((odd, i) => (
          <Fragment key={odd.id}>
            {i === 1 && (
              <Outcome
                value={odd.odds}
                prevValue={odd.prevOdds}
                onClick={() => {
                  console.log("handle total change");
                }}
              />
            )}
            <Outcome
              isActive={selectedOdd && selectedOdd.outcomeId === odd.id}
              prevValue={odd.prevOdds}
              value={odd.odds}
              onClick={() => {
                updatePosition({
                  matchId: match.id,
                  gameName: "TOTAL",
                  outcomeId: odd.id,
                  outcomeName: `${odd.name}-${odd.line}`,
                  marketId: "TotalGoals",
                  // outcomeOdds: odd.odds,
                  // participants: [{ name: home.name }, { name: away.name }],
                });
              }}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default EventRow;
