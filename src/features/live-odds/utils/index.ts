export const getMatchTimeAndHalf = (
  startTime: string | Date,
  progressPercentage: number
) => {
  const totalMatchMinutes = 90;
  const progressMinutes = (progressPercentage / 100) * totalMatchMinutes;

  const start = new Date(startTime);
  const currentTime = new Date(start.getTime() + progressMinutes * 60000);

  const half = progressPercentage < 50 ? "1st Half" : "2nd Half";

  const formattedStartTime = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: "short",
  }).format(start);

  return {
    currentTime,
    half,
    matchMinutes: Math.floor(progressMinutes),
    formattedStartTime,
  };
};

export * from "./transformMatches";
