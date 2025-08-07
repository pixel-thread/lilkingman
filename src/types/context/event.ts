export interface EventI {
  id: string;
  name: string;
  date: string;
}

export interface EventContextI {
  isEventLoading: boolean;
  event: EventI | null;
  refresh: () => void;
}
