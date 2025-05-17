import { RemoveIcon, XIcon } from "../../../shared/Icons";
import { usePositions } from "../../../store";

const TicketCard = () => {
  const positions = usePositions((state) => state.positions);
  const removePosition = usePositions((state) => state.removePosition);
  const removeAllPositions = usePositions((state) => state.removeAllPosition);

  const isTicketEmpty = Object.keys(positions).length === 0;

  return (
    <div className="bg-white-200 rounded-lg overflow-y-auto">
      <div className="flex justify-between items-center border-b border-green-500 p-3.5">
        <span className="text-black font-semibold ">Ticket</span>
        {!isTicketEmpty && (
          <span className="cursor-pointer">
            <RemoveIcon onClick={removeAllPositions} />
          </span>
        )}
      </div>

      <div className="bg-table-row p-2">
        {isTicketEmpty ? (
          <p className="text-gray-600 text-center">The ticket is empty</p>
        ) : (
          <div className="pb-1">
            {Object.entries(positions).map(([matchId, ticket]) => {
              return (
                <div
                  key={matchId}
                  className="text-white-200 flex flex-col gap-1.5  border mb-1 rounded-lg p-4 text-xs bg-black-500"
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      {ticket.participants.map(({ name }) => (
                        <p className="text-sm truncate max-w-[200px]">{name}</p>
                      ))}
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

                  <div className="pl-2">
                    <p>{ticket.gameName}</p>
                    <p className="text-gray-400">{ticket.outcomeName}</p>
                    <p className="text-white text-sm ">{ticket.outcomeOdds}</p>
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
