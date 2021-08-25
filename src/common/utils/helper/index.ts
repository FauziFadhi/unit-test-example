export const circularToJSON = (circular: unknown) =>
  JSON.parse(JSON.stringify(circular));
