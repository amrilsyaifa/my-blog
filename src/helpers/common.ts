export const diffYears = (firstDate: Date, secondDate: Date) => {
  const diffTime = Math.abs(secondDate.getTime() - firstDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
};
