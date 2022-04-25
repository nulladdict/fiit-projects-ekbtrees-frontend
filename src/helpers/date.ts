import dayjs from 'dayjs';

export const formatDate = (
	timestamp: number,
	format: string = 'DD.MM.YYYY HH:mm:ss'
): string => {
	const date = new Date(timestamp);
	return dayjs(date).format(format);
};
