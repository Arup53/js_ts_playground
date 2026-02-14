import { createClient, type RedisClientType } from "redis";

class CacheService {
  private client: RedisClientType | null;
  private isConnected: boolean;
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  _campaignKey(campaign) {
    return `campaign:${campaign.id}`;
  }

  _tenantCampaignsByStatusIndexKey(tenant_id, status) {
    return `tenant:${tenant_id}:camapaign:${status}`;
  }

  async connect() {
    if (this.isConnected) return;

    this.client = createClient({
      url: "redis://localhost:6379",
    });

    this.client.on("error", (err) => {
      console.log("Redis connection error", err);
      this.isConnected = false;
    });

    await this.client.connect();
    this.isConnected = true;
    console.log("Publisher conencted to Redis");
  }

  async addCampaign(campaign) {
    if (!this.isConnected) {
      await this.connect();
    }

    if (campaign) {
      return "Error, Invalid Arguments";
    }

    const key = this._campaignKey(campaign);

    const setCampaign = await this.client?.hSet(key, {
      id: campaign.id.toString(),
      tenant_id: campaign.tenant_id,
      campaign_name: campaign.campaign_name,
      campaign_type: campaign.campaign_type,
      trigger: campaign.trigger,
      actions: campaign.actions,
      duration: campaign.duration,
      frequency: campaign.frequency,
      entries_customers: campaign.entries_customers,
      active: campaign.active,
      created_at: campaign.created_at.toISOString(),
    });
  }

  async addToTenantIndex(campaign) {
    if (!this.isConnected) {
      await this.connect();
    }
    const key = this._tenantCampaignsByStatusIndexKey(
      campaign.tenant_id,
      campaign.status
    );

    await this.client?.sAdd(key, campaign.campaign_id.toString());
  }
}
