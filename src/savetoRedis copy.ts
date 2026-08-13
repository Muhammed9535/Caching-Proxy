import client, { connectRedis } from "./redisCache.ts";

export const saveToRedis = async (key: string, value: string) => {
  await client.set(key, value, {
    EX: 300,
  });
};

export const getValueFromRedis = async (key: string) => {
  const response = await client.get(key);
  return response;
};

export const clearCahce = async () => {
  // console.log("about to");
  await connectRedis();

  await client.flushAll();
};
