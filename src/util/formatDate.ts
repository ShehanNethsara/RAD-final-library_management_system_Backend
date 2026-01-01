// දිනයක් දුන්නම "2024-01-01" විදිහට ආපහු දෙනවා
export const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split('T')[0];
};

// දින දෙකක් අතර වෙනස (දඩ මුදල් ගණනය කරන්න වගේ දේකට)
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // පැය * විනාඩි * තත්පර * මිලි තත්පර
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.round(diffTime / oneDay);
};