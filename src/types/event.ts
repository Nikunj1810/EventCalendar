export type Frequency = "daily" | "weekly" | "monthly";

export interface EventItem {
  id: number;
  title: string;
  description?: string | null;
  startDate: string; // ISO date/time
  endDate: string; // ISO date/time
  isRecurring: boolean;
  frequency?: Frequency | null;
  daysOfWeek?: string[] | null; // e.g. ["Mon","Wed"]
  createdAt: string;
  updatedAt: string;
}
