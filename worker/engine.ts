enum Status {
  Active = "ACTIVE",
  Completed = "COMPLETED",
}

interface Campaigns {
  camp_id: string;
  tenant_id: string;
  trigger: {
    type: "event";
    eventName: string;
  };
  status: Status.Active | Status.Completed;
  notification_services: [];
  template: string; // s3 url
  start_at: string;
  end_at: string;
}

const campaigns = [
  {
    campaign_id: 1,
    trigger: {
      event: "sign_up",
    },
    actions: [
      { channel: "sms", template_id: "s3bucketjigna" },
      { channel: "slack", template_id: "ks3bucketjigna" },
      { channel: "email", template_id: "es3bucketjigna" },
    ],
  },
  {
    campaign_id: 2,
    trigger: {
      event: "logged_in_30days",
    },
  },
  {
    campaign_id: 3,
    trigger: {
      event: "cart_abadonment",
    },
  },
  {
    campaign_id: 4,
    trigger: {
      event: "purchase",
    },
  },
];

const event = {
  tenant_id: "abc1",
  person_id: 42,
  anonymous_id: "jiglypuf",
  event: "sign_up",
};

// async function main(event) {
//   const campaigns: any = [];
//   for (const campaign of campaigns) {
//     process(campaign, event);
//   }
// }

function matchCampaigns(event, campaigns) {
  const campaigns_Map: any = {};

  for (const campaign of campaigns) {
    if (campaign.trigger.event !== Object.keys(campaigns_Map))
      campaigns_Map[campaign.trigger.event] = campaign;
  }

  let matched = [];
  for (const [key, value] of Object.entries(campaigns_Map)) {
    if (key === event.event) {
      matched.push(value);
    }
  }
  console.log(matched.length);

  return matched;
}

async function process(matched_campaigns) {
  // if (campaign.status === Status.Completed) {
  //   return "campaign completed";
  // }
  // if (!event.person_id) {
  //   return "No anonymous event processing";
  // }
  // if (event.event === campaign.trigger.eventName) {
  // }

  // o(n*m) is acceptable here because matched_campaigns will not be 1M; it will always be a low number
  for (const campaign of matched_campaigns) {
    for (const action of campaign.actions) {
      console.log(
        " publisher.publish(" + action.channel + "," + "JSON.stringfy(",
        action.template_id + ")" + ")"
      );
    }
  }
}

// matchCampaigns(event, campaigns);
process(matchCampaigns(event, campaigns));
