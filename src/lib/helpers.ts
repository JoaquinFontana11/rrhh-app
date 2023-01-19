export const diffDays = (date1: string, date2: string) =>
	Math.ceil((new Date(date1).getTime() - new Date(date2).getTime()) / (1000 * 3600 * 24));
