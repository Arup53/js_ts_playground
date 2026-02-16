import CampaignService from "./campaignService";

async function test() {
  const campaignService = new CampaignService();

  await campaignService.init();
  console.log("connected sucessfully to redis");
  const result = await campaignService.getCampaignsOfTenantByStatus(
    58922,
    "active"
  );
  console.log(result);

  await campaignService.quit();
  process.exit(0);
}

test();
