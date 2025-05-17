import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { generateInitialMatches } from "../../mock";
import OddsRow from "./components/OddsRow";

const MOCK_MATCHES = generateInitialMatches();

const LiveOddsBoard = () => {
  return (
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
              <OddsRow match={data[index]} />
            </div>
          )}
        </List>
      )}
    </AutoSizer>
  );
};

export default LiveOddsBoard;
