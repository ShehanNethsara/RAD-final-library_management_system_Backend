export const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split('T')[0];
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; 
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.round(diffTime / oneDay);
};