// enum Status {
//   Active = "ACTIVE",
//   Completed = "COMPLETED",
// }

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

// interface Campaigns {
//   camp_id: string;
//   tenant_id: string;
//   trigger: {
//     type: "event";
//     eventName: string;
//   };
//   status: Status.Active | Status.Completed;
//   notification_services: [];
//   template: string; // s3 url
//   start_at: string;
//   end_at: string;
// }

// const campaigns = [
//   {
//     campaign_id: 1,
//     trigger: {
//       event: "sign_up",
//     },
//     actions: [
//       { channel: "sms", template_id: "s3bucketjigna" },
//       { channel: "slack", template_id: "ks3bucketjigna" },
//       { channel: "email", template_id: "es3bucketjigna" },
//     ],
//   },
//   {
//     campaign_id: 2,
//     trigger: {
//       event: "logged_in_30days",
//     },
//   },
//   {
//     campaign_id: 3,
//     trigger: {
//       event: "cart_abadonment",
//     },
//   },
//   {
//     campaign_id: 4,
//     trigger: {
//       event: "purchase",
//     },
//   },
// ];

// const event = {
//   tenant_id: "abc1",
//   person_id: 42,
//   anonymous_id: "jiglypuf",
//   event: "sign_up",
// };

// async function main(event) {
//   const campaigns: any = [];
//   for (const campaign of campaigns) {
//     process(campaign, event);
//   }
// }

// function matchCampaigns(event, campaigns) {
//   const campaigns_Map: any = {};

//   for (const campaign of campaigns) {
//     if (campaign.trigger.event !== Object.keys(campaigns_Map))
//       campaigns_Map[campaign.trigger.event] = campaign;
//   }

//   let matched = [];
//   for (const [key, value] of Object.entries(campaigns_Map)) {
//     if (key === event.event) {
//       matched.push(value);
//     }
//   }

//   return matched;
// }

// async function process(matched_campaigns, event) {
//   // if (campaign.status === Status.Completed) {
//   //   return "campaign completed";
//   // }
//   // if (!event.person_id) {
//   //   return "No anonymous event processing";
//   // }
//   // if (event.event === campaign.trigger.eventName) {
//   // }
//   const { person_id } = event;

//   // o(n*m) is acceptable here because matched_campaigns will not be 1M; it will always be a low number
//   for (const campaign of matched_campaigns) {
//     for (const action of campaign.actions) {
//       console.log(
//         JSON.stringify({
//           person_id,
//           template: action.template_id,
//         })
//       );
//     }
//   }
// }

// // matchCampaigns(event, campaigns);
// process(matchCampaigns(event, campaigns), event);
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
      console.log(event.event);
      console.log(campaign.trigger.event_name);
      ////////also check for tenant_id
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
