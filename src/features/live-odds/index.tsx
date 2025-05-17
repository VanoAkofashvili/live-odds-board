import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { generateInitialMatches } from "../../mock";
import EventRow from "./components/EventRow";
import TicketCard from "./components/TicketCard";

const MOCK_MATCHES = generateInitialMatches();

const LiveOddsBoard = () => {
  return (
    <main className="flex px-2 h-full gap-2">
      <div className="flex-1">
        <AutoSizer>
          {({ width, height }) => (
            <List
              itemData={MOCK_MATCHES}
              height={height}
              itemCount={MOCK_MATCHES.length}
              itemSize={150}
              width={width}
            >
              {({ data, style, index }) => (
                <div style={style} className="my-2">
                  <EventRow match={data[index]} />
                </div>
              )}
            </List>
          )}
        </AutoSizer>
      </div>
      <aside className="w-80">
        <TicketCard matches={MOCK_MATCHES} />
      </aside>
    </main>
  );
};

export default LiveOddsBoard;
