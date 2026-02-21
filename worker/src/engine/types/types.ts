export enum CamapaignTypes {
  event = "event",
  attribute = "attribute",
  segment = "segment",
}

export enum Channel {
  sms = "sms",
  email = "email",
  slack = "slack",
}

export interface Action {
  channel: Channel;
  message: string;
}

export enum Operator {
  equals = "equals",
  notEquals = "notEquals",
  greaterThan = "greaterThan",
  lessThan = "lessThan",
  contains = "contains",
  exists = "exists",
}

export enum Frequency {
  every_time = "every_time",
  one_time = "one_time",
}

export interface Entries {
  [key: number]: string;
}

export interface EventProperties {}

export interface EventInterface {
  tenant_id: number;
  anonymous_id: number;
  user_id?: number;
  event: string;
  properties?: EventProperties;
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

export interface SNSTopic {
  arn: string | null;
  error: string;
}

export interface SNSTopicConfig {
  sms: SNSTopic;
  email: SNSTopic;
  slack: SNSTopic;
}
