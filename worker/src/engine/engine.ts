import Publisher from "./publisher";
import CampaignService from "./services/campaignService";
import {
  CamapaignTypes,
  Channel,
  Frequency,
  type Action,
  type Campaign,
  type CampaignActions,
  type EventInterface,
} from "./types/types";

// this will be this.tenant_id after class implemention

const event1: EventInterface = {
  tenant_id: 58922,
  anonymous_id: 5611,
  user_id: 420,
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

// let matched_campagins: Campaign[] = [];

// function processMatchedCampaigns(event, matched_campagins) {
//   matched_campagins.forEach((campaign: Campaign) => {
//     campaign.actions.action.forEach((action: Action) => {
//       campaign.trigger.conditions.forEach((condition) => {
//         if (
//           condition.base_condition &&
//           campaign.frequency === 1 &&
//           !Object.hasOwn(campaign.entries_customers, event.user_id)
//         ) {
//           console.log(action);
//           publisher.publish(
//             action.channel,
//             JSON.stringify({
//               message: action.message,
//               user_id: event.user_id,
//               tenant_id: tenant_id,
//             })
//           );
//           campaign.entries_customers[event.user_id] = "subscribed";
//         } else if (condition.segment_filter) {
//         } else if (condition.attrubute_filter) {
//         }
//       });
//     });
//   });
// }

// matchCampaigns(event1, campaigns);
// processMatchedCampaigns(event1, matched_campagins);

export default class Engine {
  private publisher: Publisher | null;
  private campaignService: CampaignService | null;

  constructor(publisher: Publisher, campaignService: CampaignService) {
    this.publisher = publisher;
    this.campaignService = campaignService;
  }

  async fethActiveCampaigns(eventTenantId, status = true) {
    const campaigns = await this.campaignService?.getCampaignsOfTenantByStatus(
      eventTenantId,
      status
    )!;
    if (campaigns?.length === 0) {
      return "Error, Engine failed to fetch campaigns";
    }
    return campaigns;
  }

  async matchedCampaigns(event, activeCampaigns) {
    let matched_campagins: Campaign[] = [];
    for (const campaign of activeCampaigns) {
      if (event.event === campaign.trigger.event_name) {
        //also check for tenant_id
        console.log(event.event);
        console.log(campaign.trigger.event_name);

        matched_campagins.push(campaign);
      }
    }
    return matched_campagins;
  }

  async processMatchedCampaigns(event, matched_campagins) {
    let result = true;

    try {
      matched_campagins.forEach((campaign: Campaign) => {
        campaign.actions.action.forEach((action: Action) => {
          campaign.trigger.conditions.forEach((condition) => {
            if (
              condition.base_condition &&
              campaign.frequency === 1 &&
              !Object.hasOwn(campaign.entries_customers, event.user_id)
            ) {
              console.log(action);
              this.publisher?.publish(
                action.channel,
                JSON.stringify({
                  message: action.message,
                  user_id: event.user_id,
                  tenant_id: event.tenant_id,
                })
              );
              campaign.entries_customers[event.user_id] = "subscribed";
            } else if (condition.segment_filter) {
            } else if (condition.attrubute_filter) {
            }
          });
        });
      });
      return true;
    } catch (e) {
      console.log("Error, in processMatchedCampaigns method in engine class");
      result = false;
    }
  }

  async process(event) {
    if (!this.publisher || !this.campaignService) {
      console.log("Error, object not instanited in engine");
      return;
    }

    try {
      const active_campaigns = await this.fethActiveCampaigns(event.tenant_id);
      const matched_campagins = await this.matchedCampaigns(
        event,
        active_campaigns
      );
      const result = await this.processMatchedCampaigns(
        event,
        matched_campagins
      );
      console.log("worker has completed processing event", event.event);
    } catch (e) {
      console.log("Error in processor");
    }
  }
}

async function test() {
  const publisherObj = new Publisher();
  const campaignServiceObj = new CampaignService();
  const engine = new Engine(publisherObj, campaignServiceObj);

  // const active = await engine.fethActiveCampaigns(58922);
  // const matched = await engine.matchedCampaigns(event1, active);
  // const processWorkflow = await engine.processMatchedCampaigns(event1, matched);
  // console.log(processWorkflow);

  // await engine.process(event1);

  await engine.process(event1);
}
