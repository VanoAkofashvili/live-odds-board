import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import TicketCard from "./components/TicketCard";
import { useOddsData } from "./store";
import { useEffect, useState } from "react";
import { getMatches } from "./api/getMatches";
import { transformMatches } from "./utils";
import { TicketIcon, XIcon } from "../../shared/components/Icons";
import { cn } from "../../shared/utils";
import RowRenderer from "./components/RowRenderer";

const LiveOddsBoard = () => {
  const { isLoading, matches, setMatches, updateMatches, positions } =
    useOddsData();

  const [isTicketVisible, setIsTicketVisible] = useState(false);

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
              itemSize={120}
              width={width}
              itemKey={(index) => matchesData![index].id}
            >
              {RowRenderer}
            </List>
          )}
        </AutoSizer>
      </div>
      <div className="relative">
        {isTicketVisible && (
          <div className="fixed lg:hidden right-0 overflow-hidden top-0 drop-shadow-lg drop-shadow-black min-w-80 rounded-2xl">
            <TicketCard />
          </div>
        )}
        <div
          title="Ticket"
          className={cn(
            "lg:hidden",
            "fixed bottom-10 right-10 w-20 h-20 rounded-full bg-outcome-active flex justify-center items-center cursor-pointer text-white",
            "hover:transform hover:-translate-y-1 transition-all ease-in-out duration-300"
          )}
          onClick={() => {
            setIsTicketVisible((prev) => !prev);
          }}
        >
          <span className="absolute top-0 right-0 rounded-full h-5 w-5 text-xs bg-gray-800 flex items-center justify-center text-white">
            {Object.keys(positions).length}
          </span>
          {isTicketVisible ? (
            <XIcon className="w-10" />
          ) : (
            <TicketIcon className="w-10" />
          )}
        </div>
        <aside className="w-80 hidden lg:block">
          <TicketCard />
        </aside>
      </div>
    </main>
  );
};

export default LiveOddsBoard;
