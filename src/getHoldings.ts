// Fetches ERC-20 token balances for a given EVM address using viem
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

// ERC-20 ABI fragment for balanceOf, symbol, decimals, name
const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
];

// Example list of popular ERC-20 token contract addresses (mainnet)
const tokenList = [
  // USDT
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  // USDC
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  // DAI
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  // WETH
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
] as const;

type TokenAddress = (typeof tokenList)[number];

export async function getTokenHoldings(address: string) {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const results = await Promise.all(
    tokenList.map(async (token) => {
      try {
        const [balance, symbol, decimals, name] = await Promise.all([
          client.readContract({
            address: token as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
          }) as Promise<bigint>,
          client.readContract({
            address: token as `0x${string}`,
            abi: erc20Abi,
            functionName: "symbol",
          }) as Promise<string>,
          client.readContract({
            address: token as `0x${string}`,
            abi: erc20Abi,
            functionName: "decimals",
          }) as Promise<number>,
          client.readContract({
            address: token as `0x${string}`,
            abi: erc20Abi,
            functionName: "name",
          }) as Promise<string>,
        ]);
        // Only return tokens with a nonzero balance
        if (Number(balance) === 0) return null;
        return {
          token,
          name,
          symbol,
          balance: Number(balance) / 10 ** decimals,
        };
      } catch (e) {
        return null;
      }
    })
  );

  // Only return non-null results (tokens with nonzero balance)
  return results.filter(Boolean);
}

// Example usage:
(async () => {
  const address = "0x0000000000000000000000000000000000000000"; // Replace with user address
  const holdings = await getTokenHoldings(address);
  console.log(holdings);
})();
