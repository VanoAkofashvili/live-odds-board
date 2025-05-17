import { Fragment } from "react/jsx-runtime";
import { usePositions } from "../../../store";
import type { Match } from "../../../types";
import { getMatchTimeAndHalf } from "../utils";

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

  const updatePosition = usePositions((state) => state.updatePosition);

  // Betting Options
  const oneXTwo = match.markets["1X2"].selections;
  const doubleChance = match.markets["DoubleChance"].selections;
  const totalGoals = match.markets["TotalGoals"].selections;

  const matchTimeAndHalf = getMatchTimeAndHalf(
    match.startTime,
    match.matchProgress
  );

  return (
    <div className="bg-table-row text-black p-4 rounded-lg mx-auto">
      {/* HEADER */}
      <div className="grid grid-cols-14 gap-2 items-center text-sm border-b border-gray-700 pb-2">
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
            <>
              {i === 1 && <Th label={odd.name} className="text-center" />}
              <Th label={odd.name} className="text-center" />
            </>
          );
        })}
      </div>

      {/* DATA */}
      <div className="mt-2 grid grid-cols-14 gap-2 items-center">
        {/* Match time and pairs */}
        <div className="col-span-1 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
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
          <Fragment>
            {i === 1 && (
              <Outcome
                value={odd.odds}
                onClick={() => {
                  console.log("handle total change");
                }}
              />
            )}
            <Outcome
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
};
const Outcome: React.FC<OutcomeProps> = ({ value, onClick }) => (
  <div className="col-span-1">
    <button
      className="bg-gray-500 hover:bg-gray-50 cursor-pointer rounded-lg w-full border border-transparent hover:border-green-500 py-3 text-center"
      onClick={onClick}
    >
      {value}
    </button>
  </div>
);

export default EventRow;
