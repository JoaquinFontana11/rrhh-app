export const diffDays = (date1: string, date2: string) =>
	Math.ceil((new Date(date1).getTime() - new Date(date2).getTime()) / (1000 * 3600 * 24));

export const diffMonths = (date1: string, date2: string) => {
	return (
		new Date(date1).getMonth() -
		new Date(date2).getMonth() +
		(new Date(date1).getFullYear() - new Date(date2).getFullYear()) * 12
	);
};
