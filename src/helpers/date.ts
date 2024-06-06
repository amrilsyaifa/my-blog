export const getYearDifference = (date1: string, date2: string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  let yearDifference = d2.getFullYear() - d1.getFullYear();

  // Adjust the difference if the current date has not yet reached the month and day of the first date
  if (
    d2.getMonth() < d1.getMonth() ||
    (d2.getMonth() === d1.getMonth() && d2.getDate() < d1.getDate())
  ) {
    yearDifference--;
  }

  return yearDifference;
};
