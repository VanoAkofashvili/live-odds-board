import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import EventRow from "./components/EventRow";
import TicketCard from "./components/TicketCard";
import { useOddsData } from "./store";
import { useEffect } from "react";
import { getMatches } from "./api/getMatches";
import { transformMatches } from "./utils";

const LiveOddsBoard = () => {
  const { isLoading, matches, setMatches, updateMatches } = useOddsData();

  useEffect(() => {
    getMatches().then((data) => {
      setMatches(data);
    });
  }, [setMatches]);

  useEffect(() => {
    const socket = new WebSocket("wss://live-updates.com");

    socket.addEventListener("message", (event) => {
      updateMatches(transformMatches(JSON.parse(event.data)));
    });
  }, []);

  if (isLoading && !matches) return <div>loading...</div>;

  const matchesData = Object.values(matches!);

  return (
    <main className="flex gap-2 h-screen">
      <div className="flex-1">
        <AutoSizer>
          {({ width, height }) => (
            <List
              itemData={matchesData}
              height={height}
              itemCount={matchesData!.length}
              itemSize={150}
              width={width}
              itemKey={(index) => matchesData![index].id}
            >
              {({ data, style, index }) => (
                <div style={style}>
                  <EventRow match={data![index]} />
                </div>
              )}
            </List>
          )}
        </AutoSizer>
      </div>
      <aside className="w-80 overflow-y-auto">
        <TicketCard />
      </aside>
    </main>
  );
};

export default LiveOddsBoard;
