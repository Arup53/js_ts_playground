import { createClient, type RedisClientType } from "redis";
import type { Campaign } from "../types/types";

class CacheService {
  private client: RedisClientType | null;
  private isConnected: boolean;
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  _campaignKey(camapaignId) {
    return `campaign:${camapaignId}`;
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

  async addCampaignToCache(campaign) {
    if (!this.isConnected) {
      await this.connect();
    }

    if (campaign) {
      return "Error, Invalid Arguments";
    }

    const key = this._campaignKey(campaign.id);

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

  async addToTenantIndex(tenant_id, status, campaign_id) {
    if (!this.isConnected) {
      await this.connect();
    }
    const key = this._tenantCampaignsByStatusIndexKey(tenant_id, status);

    await this.client?.sAdd(key, campaign_id.toString());
  }

  // ------------------- Get all campaign by active status ---------
  
  async getAllCampaignByStatus(tenant_id, status){
    if (!tenant_id || !status) return "Error, tenant_id or status can not be null"
    let results=[];
    const indexKey= this._tenantCampaignsByStatusIndexKey(tenant_id,status);
    const campaignIds= await this.client?.sMembers(indexKey)!;
    if (campaignIds.length===0) return "Error, no campaigns ids"
    try{
      for(const campaignId of campaignIds ){
      const campaignKey=this._campaignKey(campaignId) 
      const res= await this.client?.hGetAll(campaignId)!
      console.log("HGETALL",res);
      if(Object.keys(res).length){
        results.push(res);
      }
    }
    }catch (err){
      console.log("Error while fetching campaigns")
    }
    return results;
  }
  
  
}
