import { Fragment } from "react/jsx-runtime";
import { useOddsData } from "../store";
import type { Match } from "../../../types";
import { getMatchTimeAndHalf } from "../utils";
import { cn } from "../../../shared/utils";
import { useEffect, useState } from "react";

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
    <div className="bg-table-row text-black  mx-auto">
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
      <div className="mt-2 grid grid-cols-14 gap-2 items-center px-4">
        {/* Match time and pairs */}
        <div className="col-span-1 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-ping"></div>
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
            isSelected={selectedOdd && selectedOdd.outcomeId === odd.id}
            value={odd.odds}
            onClick={() => {
              updatePosition({
                matchId: match.id,
                gameName: "1X2",
                outcomeId: odd.id,
                outcomeName: odd.name,
                outcomeOdds: odd.odds,
                participants: [{ name: home.name }, { name: away.name }],
              });
            }}
          />
        ))}
        {doubleChance.map((odd) => (
          <Outcome
            isSelected={selectedOdd && selectedOdd.outcomeId === odd.id}
            value={odd.odds}
            onClick={() => {
              updatePosition({
                matchId: match.id,
                gameName: "Double Chance",
                outcomeId: odd.id,
                outcomeName: odd.name,
                outcomeOdds: odd.odds,
                participants: [{ name: home.name }, { name: away.name }],
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
                onClick={() => {
                  console.log("handle total change");
                }}
              />
            )}
            <Outcome
              isSelected={selectedOdd && selectedOdd.outcomeId === odd.id}
              value={odd.odds}
              onClick={() => {
                updatePosition({
                  matchId: match.id,
                  gameName: "TOTAL",
                  outcomeId: odd.id,
                  outcomeName: `${odd.name}-${odd.line}`,
                  outcomeOdds: odd.odds,
                  participants: [{ name: home.name }, { name: away.name }],
                });
              }}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

type OutcomeProps = {
  onClick: VoidFunction;
  value: string | number;
  isSelected?: boolean;
};

const Outcome: React.FC<OutcomeProps> = ({
  value,
  onClick,
  isSelected = false,
}) => {
  const [prevValue, setPrevValue] = useState<string | number>(value);
  const [animateGreen, setAnimateGreen] = useState(false);
  const [animateRed, setAnimateRed] = useState(false);

  useEffect(() => {
    // Convert values to numbers for comparison
    const numPrevValue =
      typeof prevValue === "string" ? parseFloat(prevValue) : prevValue;
    const numCurrentValue =
      typeof value === "string" ? parseFloat(value) : value;

    // Only animate if value has changed
    if (numPrevValue !== numCurrentValue) {
      if (numCurrentValue > numPrevValue) {
        // Odds increased - green animation
        setAnimateGreen(true);
        setTimeout(() => setAnimateGreen(false), 1000);
      } else if (numCurrentValue < numPrevValue) {
        // Odds decreased - red animation
        setAnimateRed(true);
        setTimeout(() => setAnimateRed(false), 1000);
      }

      // Update previous value
      setPrevValue(value);
    }
  }, [value]);

  return (
    <div>
      <span onClick={() => setAnimateGreen(true)}>set</span>
      <button
        className={cn(
          "col-span-1",
          "cursor-pointer rounded-lg w-full border border-transparent h-9 relative overflow-hidden hover:border-green-500 text-center",
          isSelected
            ? "bg-green-500 text-white"
            : "bg-gray-500 hover:bg-gray-50"
        )}
        onClick={onClick}
      >
        {/* Green animation - rises from bottom */}
        {animateGreen && (
          <div className="absolute w-full h-full bottom-0 animate-oddsRise bg-gradient-to-t from-green-400 duration-100 to-transparent " />
        )}

        {/* Red animation - falls from top */}
        {animateRed && (
          <div className="absolute w-full h-full top-0 animate-oddsFall bg-gradient-to-b from-red-400 duration-100 to-transparent " />
        )}

        {/* The odds value */}
        <span
          className={cn(
            "relative z-10",
            animateGreen ? "text-green-900" : "",
            animateRed ? "text-red-900" : ""
          )}
        >
          {value}
        </span>
      </button>
    </div>
  );
};

// const Outcome: React.FC<OutcomeProps> = ({
//   value,
//   onClick,
//   isSelected = false,
// }) => {
//   return (
//     // <div className="col-span-1">
//     <button
//       className={cn(
//         "col-span-1",
//         "cursor-pointer rounded-lg w-full border border-transparent h-9 relative hover:border-green-500 text-center",
//         isSelected ? "bg-green-500 text-white" : "bg-gray-500 hover:bg-gray-50"
//       )}
//       onClick={onClick}
//     >
//       {value}
//     </button>
//     // </div>
//   );
// };

export default EventRow;
