import { useOdds } from "../../../store";
import type { Match } from "../../../types";
import { getMatchTimeAndHalf } from "../utils";

type OddsRowProps = {
  match: Match;
};

const Th = ({ span = 1, label }: { span?: number; label: string }) => (
  <div className={`col-span-${span}`}>{label}</div>
);

const OddsRow: React.FC<OddsRowProps> = ({ match }) => {
  const { home, away } = match.competitors;

  const updateOdd = useOdds((state) => state.updateOdd);

  const handleOddClick = ({ matchId, oddId }) => {
    updateOdd({ matchId, oddId });
  };

  // Betting Options
  const oneXTwo = match.markets["1X2"].selections;
  const doubleChance = match.markets["DoubleChance"].selections;
  const totalGoals = match.markets["TotalGoals"].selections;

  const matchTimeAndHalf = getMatchTimeAndHalf(
    match.startTime,
    match.matchProgress
  );
  console.log(match);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg mx-auto">
      {/* HEADER */}
      <div className="grid grid-cols-14 gap-2 items-center text-sm border-b border-gray-700 pb-2">
        <Th label="Time" />
        <Th label="Pair" span={3} />
        <Th label="Score" />

        {/* BETTING OPTIONS */}
        {oneXTwo.map((odd) => (
          <Th key={odd.id} label={odd.name} />
        ))}
        {doubleChance.map((odd) => (
          <Th key={odd.id} label={odd.name} />
        ))}
        {totalGoals.slice(0, 2).map((odd, i) => {
          return (
            <>
              {i === 1 && <Th label={odd.name} />}
              <Th label={odd.name} />
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
        <div className="col-span-1 bg-gray-800 rounded flex flex-col items-center justify-center py-1">
          <div className="text-center">{match.score.home}</div>
          <div className="text-center">{match.score.away}</div>
        </div>

        {[
          match.odds["1X2"].home,
          match.odds["1X2"].draw,
          match.odds["1X2"].away,
          match.odds["Double Chance"].homeOrDraw,
          match.odds["Double Chance"].awayOrDraw,
          match.odds["Double Chance"].homeOrAway,
          match.odds.Total.under,
          match.odds.Total.total,
          match.odds.Total.over,
          // TODO - add odd ids
        ].map((odd, i) => (
          <Odd
            key={`${match.id}-${i}`}
            onClick={() => handleOddClick({ matchId: match.id, oddId: odd })}
            value={odd}
          />
        ))}
      </div>
    </div>
  );
};

type OddProps = {
  onClick: VoidFunction;
  value: string | number;
};
const Odd: React.FC<OddProps> = ({ value, onClick }) => (
  <div className="col-span-1">
    <button
      className="bg-gray-700 hover:bg-gray-600 rounded w-full py-1 text-center"
      onClick={onClick}
    >
      {value}
    </button>
  </div>
);

export default OddsRow;
