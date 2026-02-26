import express from "express";

/**
 * Creates and returns the Express app wired to the provided ThorClient.
 * Accepting the client as a parameter makes every route independently testable
 * without touching the real VeChain network.
 */
export function createApp(thor) {
  const app = express();

  // GET /metrics/summary
  app.get("/metrics/summary", async (req, res) => {
    try {
      const best = await thor.blocks.getBestBlockExpanded();
      res.json({
        source: "vechain-sdk",
        bestBlockNumber: best.number ?? null,
        bestBlockId: best.id ?? null,
        bestBlockTimestamp: best.timestamp ?? null,
        txCount: Array.isArray(best.transactions) ? best.transactions.length : 0,
        gasUsed: best.gasUsed ?? 0
      });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // GET /block/:id  (integer number or 0x-prefixed block ID)
  app.get("/block/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const revision = id.startsWith("0x") ? id : parseInt(id, 10);
      const block = await thor.blocks.getBlockCompressed(revision);
      if (!block) return res.status(404).json({ error: "Block not found" });
      res.json(block);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // GET /tx/:id  (0x-prefixed transaction ID)
  app.get("/tx/:id", async (req, res) => {
    try {
      const tx = await thor.transactions.getTransaction(req.params.id);
      if (!tx) return res.status(404).json({ error: "Transaction not found" });
      res.json(tx);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // GET /account/:address
  app.get("/account/:address", async (req, res) => {
    try {
      const account = await thor.accounts.getAccount(req.params.address);
      res.json(account);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  return app;
}
