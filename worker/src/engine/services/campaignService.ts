// createCampaign, getCampaignsByStatus,updateCampaign

import type { Campaign } from "../types/types";
import { cacheService } from "./cacheService";

class CampaignService {
  async init() {
    await cacheService.connect();
    console.log("CampaignsService ready with Redis connected");
  }

  async createCampaign(camapaign: Campaign) {
    if (!cacheService.connectStatus()) {
      await this.init();
    }

    const resCampaign = await cacheService.addCampaignToCache(camapaign);
    console.log("Service worker sucessfully cached campaign", resCampaign);
    const resIndex = await cacheService.addToTenantIndex(
      camapaign.tenant_id,
      camapaign.active,
      camapaign.campaign_id
    );
  }
}
