import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

// ── mock ThorClient ───────────────────────────────────────────────────────────

function makeMockThor(overrides = {}) {
  return {
    blocks: {
      getBestBlockExpanded: vi.fn(),
      getBlockCompressed: vi.fn(),
      ...overrides.blocks,
    },
    transactions: {
      getTransaction: vi.fn(),
      ...overrides.transactions,
    },
    accounts: {
      getAccount: vi.fn(),
      ...overrides.accounts,
    },
  };
}

// ── /metrics/summary ─────────────────────────────────────────────────────────

describe("GET /metrics/summary", () => {
  it("returns mapped fields from getBestBlockExpanded", async () => {
    const thor = makeMockThor();
    thor.blocks.getBestBlockExpanded.mockResolvedValue({
      number: 18547892,
      id: "0xabc123",
      timestamp: 1700000000,
      transactions: ["0xtx1", "0xtx2", "0xtx3"],
      gasUsed: 210000,
    });

    const res = await request(createApp(thor)).get("/metrics/summary");

    expect(res.status).toBe(200);
    expect(res.body.bestBlockNumber).toBe(18547892);
    expect(res.body.bestBlockId).toBe("0xabc123");
    expect(res.body.bestBlockTimestamp).toBe(1700000000);
    expect(res.body.txCount).toBe(3);
    expect(res.body.gasUsed).toBe(210000);
    expect(res.body.source).toBe("vechain-sdk");
  });

  it("returns txCount 0 when transactions array is empty", async () => {
    const thor = makeMockThor();
    thor.blocks.getBestBlockExpanded.mockResolvedValue({
      number: 1,
      id: "0x000",
      timestamp: 1000,
      transactions: [],
      gasUsed: 0,
    });

    const res = await request(createApp(thor)).get("/metrics/summary");

    expect(res.status).toBe(200);
    expect(res.body.txCount).toBe(0);
  });

  it("returns 500 when the SDK throws", async () => {
    const thor = makeMockThor();
    thor.blocks.getBestBlockExpanded.mockRejectedValue(new Error("network error"));

    const res = await request(createApp(thor)).get("/metrics/summary");

    expect(res.status).toBe(500);
    expect(res.body.error).toContain("network error");
  });
});

// ── /block/:id ────────────────────────────────────────────────────────────────

describe("GET /block/:id", () => {
  it("fetches block by integer number", async () => {
    const thor = makeMockThor();
    thor.blocks.getBlockCompressed.mockResolvedValue({ number: 42, id: "0xblk42" });

    const res = await request(createApp(thor)).get("/block/42");

    expect(res.status).toBe(200);
    expect(res.body.number).toBe(42);
    // revision passed as a number, not a string
    expect(thor.blocks.getBlockCompressed).toHaveBeenCalledWith(42);
  });

  it("fetches block by 0x-prefixed block ID", async () => {
    const thor = makeMockThor();
    thor.blocks.getBlockCompressed.mockResolvedValue({ id: "0xblk42" });

    const res = await request(createApp(thor)).get("/block/0xblk42");

    expect(res.status).toBe(200);
    expect(thor.blocks.getBlockCompressed).toHaveBeenCalledWith("0xblk42");
  });

  it("returns 404 when block is not found", async () => {
    const thor = makeMockThor();
    thor.blocks.getBlockCompressed.mockResolvedValue(null);

    const res = await request(createApp(thor)).get("/block/99999999");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Block not found");
  });

  it("returns 500 when the SDK throws", async () => {
    const thor = makeMockThor();
    thor.blocks.getBlockCompressed.mockRejectedValue(new Error("timeout"));

    const res = await request(createApp(thor)).get("/block/1");

    expect(res.status).toBe(500);
  });
});

// ── /tx/:id ───────────────────────────────────────────────────────────────────

describe("GET /tx/:id", () => {
  it("returns transaction data", async () => {
    const thor = makeMockThor();
    const txId = "0xfc99fe103fcc";
    thor.transactions.getTransaction.mockResolvedValue({ id: txId, origin: "0x742d" });

    const res = await request(createApp(thor)).get(`/tx/${txId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(txId);
    expect(thor.transactions.getTransaction).toHaveBeenCalledWith(txId);
  });

  it("returns 404 when transaction is not found", async () => {
    const thor = makeMockThor();
    thor.transactions.getTransaction.mockResolvedValue(null);

    const res = await request(createApp(thor)).get("/tx/0xdeadbeef");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Transaction not found");
  });

  it("returns 500 when the SDK throws", async () => {
    const thor = makeMockThor();
    thor.transactions.getTransaction.mockRejectedValue(new Error("rpc error"));

    const res = await request(createApp(thor)).get("/tx/0xdeadbeef");

    expect(res.status).toBe(500);
  });
});

// ── /account/:address ─────────────────────────────────────────────────────────

describe("GET /account/:address", () => {
  it("returns account balance data", async () => {
    const thor = makeMockThor();
    const address = "0x742d35cc7af5a0e8f5f1da0e8f5f1da0e8f5f1da";
    thor.accounts.getAccount.mockResolvedValue({
      balance: "0x56bc75e2d63100000",
      energy: "0x29a2241af62c0000",
      hasCode: false,
    });

    const res = await request(createApp(thor)).get(`/account/${address}`);

    expect(res.status).toBe(200);
    expect(res.body.hasCode).toBe(false);
    expect(thor.accounts.getAccount).toHaveBeenCalledWith(address);
  });

  it("returns 500 when the SDK throws", async () => {
    const thor = makeMockThor();
    thor.accounts.getAccount.mockRejectedValue(new Error("invalid address"));

    const res = await request(createApp(thor)).get("/account/0xbad");

    expect(res.status).toBe(500);
  });
});
