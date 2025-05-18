import { useEffect, useState } from "react";
import { cn } from "../../../shared/utils";

type OutcomeProps = {
  value: number;
  prevValue?: number;
  onClick?: () => void;
  isActive?: boolean;
};

const Outcome = (props: OutcomeProps) => {
  const { value, isActive = false, prevValue, onClick } = props;
  const [animate, setAnimate] = useState("");

  useEffect(() => {
    if (!(value && prevValue)) return;

    if (value !== prevValue) {
      if (value > prevValue) setAnimate("outcome-rise");
      else setAnimate("outcome-fall");
    }
  }, [value, prevValue]);

  return (
    <div
      onClick={onClick}
      className={cn(
        "outcome relative",
        "overflow-hidden",
        isActive ? "bg-outcome-active text-white" : "bg-outcome",
        "border border-transparent hover:border-outcome-active",
        "rounded-lg",
        "flex justify-center items-center h-9 min-w-20 shrink-0",
        onClick ? "cursor-pointer" : "",
        "transition-colors",
        animate
      )}
    >
      <span className="absolute z-10">{value}</span>
    </div>
  );
};

export default Outcome;
