export const DAYS_OF_WEEK = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
