import Publisher from "./publisher";
import {
  CamapaignTypes,
  Channel,
  Frequency,
  type Action,
  type Campaign,
  type CampaignActions,
  type EventInterface,
} from "./types/types";

const tenant_id = "acme"; // this will be this.tenant_id after class implemention

const publisher = new Publisher();

const event1: EventInterface = {
  tenant_id: 58922,
  anonymous_id: 5611,
  user_id: 909999009900,
  event: "sign_up",
};

const campaigns: Campaign[] = [
  {
    tenant_id: 58922,
    campaign_id: 1,
    campaign_name: "sign_up",
    campaign_type: CamapaignTypes.event,
    trigger: {
      event_name: "sign_up",
      conditions: [{ base_condition: true }],
    },
    actions: {
      action: [{ channel: Channel.sms, message: "Hello there" }],
    },
    duration: "26th feb",
    frequency: 1,
    entries_customers: {},
    active: true,
    created_at: "1january",
  },
  {
    tenant_id: 58922,
    campaign_id: 12,
    campaign_name: "new_product",
    campaign_type: CamapaignTypes.event,
    trigger: {
      event_name: "pageview",
      conditions: [{ base_condition: true }],
    },
    actions: {
      action: [{ channel: Channel.sms, message: "New campaign" }],
    },
    duration: "16th feb",
    frequency: 1,
    entries_customers: {},
    active: true,
    created_at: "30january",
  },
];

let matched_campagins: Campaign[] = [];

function fethActiveCampaigns(tenant_id) {}

function matchCampaigns(event, activeCampaigns) {
  for (const campaign of activeCampaigns) {
    if (event.event === campaign.trigger.event_name) {
      //also check for tenant_id
      console.log(event.event);
      console.log(campaign.trigger.event_name);

      matched_campagins.push(campaign);
    }
  }
}

function processMatchedCampaigns(event, matched_campagins) {
  matched_campagins.forEach((campaign: Campaign) => {
    campaign.actions.action.forEach((action: Action) => {
      campaign.trigger.conditions.forEach((condition) => {
        if (
          condition.base_condition &&
          campaign.frequency === 1 &&
          !Object.hasOwn(campaign.entries_customers, event.user_id)
        ) {
          console.log(action);
          publisher.publish(
            action.channel,
            JSON.stringify({
              message: action.message,
              user_id: event.user_id,
              tenant_id: tenant_id,
            })
          );
          campaign.entries_customers[event.user_id] = "subscribed";
        } else if (condition.segment_filter) {
        } else if (condition.attrubute_filter) {
        }
      });
    });
  });
}

matchCampaigns(event1, campaigns);
processMatchedCampaigns(event1, matched_campagins);
