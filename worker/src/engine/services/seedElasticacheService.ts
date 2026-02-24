import { CamapaignTypes, Channel } from "../types/types";
import CampaignService from "./campaignService";

async function main() {
  const campaignService = new CampaignService();

  await campaignService.init();
  console.log("connected sucessfully to redis");

  const campaignObj1 = {
    tenant_id: 58922,
    campaign_id: 1,
    campaign_name: "sign_up",
    campaign_type: CamapaignTypes.event,
    trigger: {
      event_name: "sign_up",
      conditions: [{ base_condition: true }],
    },
    actions: {
      action: [{ channel: Channel.email, message: "Hello there" }],
    },
    duration: "26th feb",
    frequency: 1,
    entries_customers: {},
    active: true,
    created_at: "1january",
  };
  const campaignObj2 = {
    tenant_id: 58922,
    campaign_id: 1,
    campaign_name: "sign_up",
    campaign_type: CamapaignTypes.event,
    trigger: {
      event_name: "page_view",
      conditions: [{ base_condition: true }],
    },
    actions: {
      action: [{ channel: Channel.sms, message: "Hello there" }],
    },
    duration: "1th feb",
    frequency: 1,
    entries_customers: {},
    active: true,
    created_at: "30th march",
  };
  await campaignService.createCampaign(campaignObj1);
  await campaignService.createCampaign(campaignObj2);

  const result = await campaignService.getCampaignsOfTenantByStatus(
    58922,
    true
  );
  console.log(result);

  await campaignService.quit();
  process.exit(0);
}

main();
