#!/usr/bin/env node
import "dotenv/config";

import process from "process";
import yargs from "yargs";
import http from "http";
import { URL } from "url";
import { connectRedis } from "./redisCache.ts";
import { clearCahce, getValueFromRedis, saveToRedis } from "./savetoRedis.ts";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("port", {
    type: "number",
    default: 4100,
  })
  .option("origin", {
    type: "string",
    default: "http://dummyjson.com/products",
  })
  .option("clear-cache", {
    type: "boolean",
    default: false,
  })
  .parse();

  

const PORT = Number(argv.port ?? 4100);
const origin = argv.origin as string | undefined;
const clearCache = Boolean(argv["clear-cache"]);


if (clearCache) {
  await clearCahce();
  console.log("Cahce cleared");
  process.exit(0);
}

if (!origin) {
  console.error("Missing --origin");
  process.exit(1);
}

const startServer = async () => {
  await connectRedis();

  const server = http.createServer(async (req, res) => {
    const requestUrl = req.url ?? "/";
    const pathname = new URL(requestUrl, "http://localhost").pathname;

    if (pathname === "/favicon.ico" || pathname.startsWith("/.well-known/")) {
      res.writeHead(204);
      res.end();
      return;
    }

    const cacheKey = req.method + pathname;

    const cacheResponse = await getValueFromRedis(cacheKey);

    if (cacheResponse) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "X-Cache": "HIT",
      });
      res.end(cacheResponse);
    } else {
      try {
        const upstreamRes = await fetch(`${origin}`);
        const data = await upstreamRes.json();
        await saveToRedis(cacheKey, JSON.stringify(data.products ?? data));

        res.writeHead(200, {
          "Content-Type": "application/json",
          "X-Cache": "MISS",
        });

        res.end(JSON.stringify(data.products ?? data));
      } catch (err) {
        console.log(err);

        res.writeHead(500, {
          "content-type": "application/json",
        });

        res.end(JSON.stringify({ error: "proxy failed" }));
      }
    }
  });

  server.listen(PORT, () => {
    console.log(`caching proxy running on ${PORT}`);
  });
};

startServer();
