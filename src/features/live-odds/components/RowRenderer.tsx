import { memo, type CSSProperties } from "react";
import EventRow from "./EventRow";
import type { Match } from "../../../types";

type RowRendererProps = {
  style: CSSProperties;
  index: number;
  data: Match[];
};
const RowRenderer = memo(({ style, index, data }: RowRendererProps) => (
  <div style={style}>
    <EventRow match={data[index]} />
  </div>
));

export default RowRenderer;
