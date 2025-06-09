import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors' // Removed coinbaseWallet

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia],
    connectors: [
      injected(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '' }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
