export enum CamapaignTypes {
  "event",
  "attribute",
  "segment",
}

export enum Channel {
  "sms",
  "email",
  "slack",
}
export interface Action {
  channel: Channel;
  message: string;
}

export enum Operator {
  "equals",
  "notEquals",
  "greaterThan",
  "lessThan",
  "contains",
  "exists",
}

export enum Frequency {
  "every_time",
  "one_time",
}

export interface Entries {
  [key: number]: string;
}

export interface Campaign {
  tenant_id: number;
  campaign_id: number;
  campaign_name: string;
  campaign_type: CamapaignTypes;
  trigger: TriggerRule;
  actions: CampaignActions;
  duration: string;
  frequency: number;
  entries_customers: Entries;
  active: boolean;
  created_at: string;
}

export interface TriggerRule {
  event_name: string;
  conditions: Condition[];
}

export interface CampaignActions {
  action: Action[];
}

export interface filter {
  field: string;
  operator: Operator[];
}

export interface Condition {
  base_condition?: boolean;
  segment_filter?: filter[];
  attrubute_filter?: filter[];
}
