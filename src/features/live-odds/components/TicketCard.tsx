import { RemoveIcon, XIcon } from "../../../shared/components/Icons";
import type { MarketType, Match } from "../../../types";
import { useOddsData, type PositionData } from "../store";
import Outcome from "./Outcome";

const TicketCard = () => {
  const { positions, matches } = useOddsData();

  const removePosition = useOddsData((state) => state.removePosition);
  const removeAllPositions = useOddsData((state) => state.removeAllPosition);

  if (!matches) return <div>loading...</div>;

  const tickets: (Match & Omit<PositionData, "matchId">)[] = Object.keys(
    positions
  ).map((matchId) => {
    return {
      ...matches![matchId],
      ...positions[matchId],
    };
  });

  const isTicketEmpty = tickets.length === 0;

  return (
    <div className="bg-white-200 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center border-b border-outcome-active p-3.5">
        <span className="text-black font-semibold ">
          Tickets {!isTicketEmpty && <span>({tickets.length})</span>}
        </span>
        {!isTicketEmpty && (
          <span className="cursor-pointer">
            <RemoveIcon onClick={removeAllPositions} />
          </span>
        )}
      </div>

      <div className="bg-table-row p-2 max-h-[600px] overflow-hidden overflow-y-auto">
        {isTicketEmpty ? (
          <p className="text-gray-600 text-center">The ticket is empty</p>
        ) : (
          <div className="pb-1">
            {tickets.map((ticket) => {
              const matchId = ticket.id;

              const { odds } = ticket.markets[
                ticket.marketId as MarketType
              ].selections.find((s) => s.id === ticket.outcomeId)!;
              return (
                <div
                  key={matchId}
                  className="text-white-200 flex flex-col gap-1.5  border mb-1 rounded-lg p-4 text-xs bg-black-500"
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-sm truncate max-w-[200px]">
                        {ticket.competitors.home.name}
                      </p>
                      <p className="text-sm truncate max-w-[200px]">
                        {ticket.competitors.away.name}
                      </p>
                    </div>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        removePosition(matchId);
                      }}
                    >
                      <XIcon />
                    </span>
                  </div>

                  <div className="pl-2 flex flex-col gap-2">
                    <p>{ticket.gameName}</p>
                    <p className="text-gray-400">{ticket.outcomeName}</p>
                    <div className="text-white text-sm ">
                      <Outcome isActive value={odds} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
