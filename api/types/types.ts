export type EventsSchema = {
  tenant_id: number;
  anonymous_id: number;
  user_id: number;
  event: string;
  properties: Record<string, any>;
};

export type PostEventsBody = {
  events: EventsSchema[];
};
