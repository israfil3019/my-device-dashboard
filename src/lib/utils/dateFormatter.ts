export const formatDateTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    //   year: "numeric",
    hour: "2-digit",
    //   minute: "2-digit",
  }).format(new Date(timestamp * 1000));
};
