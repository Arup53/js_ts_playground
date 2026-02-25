import Redis, { Cluster } from "ioredis";
import {
  CamapaignTypes,
  Channel,
  type Action,
  type Campaign,
} from "../types/types";

export class CacheService {
  private client: Redis | Cluster | null;
  private isConnected: boolean;
  private connecting: boolean = false;
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

  connectStatus() {
    return this.isConnected; // return a proper boolean
  }

  async connect() {
    if (this.isConnected || this.connecting) return;

    this.connecting = true;

    this.client = new Redis.Cluster(
      [
        {
          host: process.env.ELASTICACHE_REDIS,
          port: Number(process.env.REDIS_PORT!),
        },
      ],
      {
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
          tls: {},
        },
      }
    );

    this.client.on("error", (err) => {
      console.log("Redis connection error", err);
      this.isConnected = false;
      this.connecting = false;
    });

    await this.client.connect();
    this.isConnected = true;
    this.connecting = false;
    console.log("Publisher connected to Redis");
  }

  async closeConnection() {
    await this.client?.quit();
    console.log("Closed Redis Connection");
  }

  async addCampaignToCache(campaign) {
    if (!this.isConnected) {
      await this.connect();
    }

    if (!campaign) {
      return "Error, Invalid Arguments";
    }

    const key = this._campaignKey(campaign.campaign_id);

    const res = await this.client?.hset(key, {
      id: campaign.campaign_id.toString(),
      tenant_id: campaign.tenant_id.toString(),
      campaign_name: campaign.campaign_name,
      campaign_type: campaign.campaign_type,
      trigger: JSON.stringify(campaign.trigger),
      actions: JSON.stringify(campaign.actions),
      entries_customers: JSON.stringify(campaign.entries_customers),
      duration: campaign.duration?.toString(),
      frequency: campaign.frequency?.toString(),
      active: campaign.active?.toString(),
      created_at: campaign.created_at,
    });
    return res;
  }

  async addToTenantIndex(tenant_id, status, campaign_id) {
    if (!this.isConnected) {
      await this.connect();
    }
    const key = this._tenantCampaignsByStatusIndexKey(tenant_id, status);

    await this.client?.sadd(key, campaign_id.toString());
  }

  // ------------------- Get all campaign by active status ---------

  async getAllCampaignByStatus(tenant_id, status: boolean) {
    if (!tenant_id || !status)
      return "Error, tenant_id or status can not be null";
    let results = [];
    const indexKey = this._tenantCampaignsByStatusIndexKey(tenant_id, status);
    console.log("indexKey", indexKey);
    const campaignIds = await this.client?.smembers(indexKey)!;
    console.log(campaignIds);
    if (campaignIds.length === 0) return "Error, no campaigns ids";
    try {
      for (const campaignId of campaignIds) {
        const campaignKey = this._campaignKey(campaignId);
        console.log("campaign key in cacheservice", campaignKey);
        console.log(typeof campaignKey);
        const unstructred_res = await this.client?.hgetall(campaignKey)!;

        const res = { ...unstructred_res };

        if (Object.keys(res).length) {
          const parsedActions = JSON.parse(res.actions!) as {
            action: Action[];
          };

          const campaign: Campaign = {
            tenant_id: Number(res.tenant_id),
            campaign_id: Number(res.id),
            campaign_name: res.campaign_name!,
            campaign_type: res.campaign_type as CamapaignTypes,
            trigger: JSON.parse(res.trigger!),
            actions: {
              action: parsedActions.action.map((a) => ({
                channel: a.channel as Channel,
                message: a.message,
              })),
            },
            duration: res.duration!,
            frequency: Number(res.frequency),
            entries_customers: JSON.parse(res.entries_customers!),
            active: res.active === "true",
            created_at: res.created_at!,
          };

          results.push(campaign);
        }
      }

      return results;
    } catch (err) {
      console.log("Error while fetching campaigns in catching service");
    }
  }

  // --------------- update/ cache invalidation -----------

  async changeCampaignStatus(tenant_id, curr_status, new_status, campaign_id) {
    const indexKeyCurrent = this._tenantCampaignsByStatusIndexKey(
      tenant_id,
      curr_status
    );
    const indexKeyNew = this._tenantCampaignsByStatusIndexKey(
      tenant_id,
      curr_status
    );

    // ---- change campaign status field in set----
    const campaignIds = await this.client?.smembers(indexKeyCurrent)!;
    const camapignIdToDelete = campaignIds.find((key) => {
      if (key === campaign_id) {
        return key;
      }
    });
    if (camapignIdToDelete) {
      const deleteRes = await this.client?.srem(
        indexKeyCurrent,
        camapignIdToDelete
      );
      const newStatus = await this.client?.sadd(
        indexKeyNew,
        camapignIdToDelete
      );
    } else {
      return "Error in deletion of key from tenantIndex";
    }
    // ---- change campaign status field in hashmap----
    const camapaignKey = this._campaignKey(campaign_id);
    const result = await this.client?.hset(camapaignKey, {
      active: new_status,
    });
    return "Success";
  }
}

export const cacheService = new CacheService();
