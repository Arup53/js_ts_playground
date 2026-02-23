import Redis from "ioredis";

const client = new Redis.Cluster(
  [
    {
      host: "clustercfg.redis-nodejs.trgjma.use1.cache.amazonaws.com",
      port: 6379,
    },
  ],
  {
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions: {
      tls: {},
    },
  }
);

(async () => {
  // Set and assert
  const setResult = await client.set("key", "value");
  console.assert(setResult === "OK");

  // Get and assert
  const getResult = await client.get("key");
  console.assert(getResult === "value");

  // Close the connection
  client.disconnect();
})();
