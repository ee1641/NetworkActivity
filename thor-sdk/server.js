import express from "express";
import { ThorClient } from "@vechain/sdk-network";

//http://localhost:4010/metrics/summary

const app = express();
const thor = ThorClient.at("https://mainnet.vechain.org");

app.get("/metrics/summary", async (req, res) => {
  try {
    const best = await thor.blocks.getBestBlockCompressed();

    res.json({
      source: "vechain-sdk",
      bestBlockNumber: best.number ?? null,
      bestBlockId: best.id ?? null,
      bestBlockTimestamp: best.timestamp ?? null
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(4010, () => console.log("thor-sdk service on http://localhost:4010"));
