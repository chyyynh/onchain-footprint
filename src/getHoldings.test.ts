import { getTokenHoldings } from "./getHoldings";

describe("getTokenHoldings", () => {
  it("returns token holdings for a valid address", async () => {
    // Example: Vitalik's address (public, well-known)
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const holdings = await getTokenHoldings(address);
    expect(Array.isArray(holdings)).toBe(true);
    // At least one token should have a nonzero balance or be present
    expect(holdings.length).toBeGreaterThan(0);
    // Each holding should have required fields
    for (const holding of holdings) {
      expect(holding).toHaveProperty("token");
      expect(holding).toHaveProperty("name");
      expect(holding).toHaveProperty("symbol");
      expect(holding).toHaveProperty("balance");
    }
  });

  it("returns an empty array for an address with no tokens", async () => {
    // All-zero address should have no tokens
    const address = "0x0000000000000000000000000000000000000000";
    const holdings = await getTokenHoldings(address);
    expect(Array.isArray(holdings)).toBe(true);
    // Should be empty array
    expect(holdings.length).toBe(0);
  });
});
