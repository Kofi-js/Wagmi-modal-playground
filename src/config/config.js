import { http, createConfig } from 'wagmi'
import { sepolia, mainnet, liskSepolia } from 'wagmi/chains'
import { injected, metaMask  } from 'wagmi/connectors'

const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
  chains: [mainnet, sepolia, liskSepolia],
  connectors: [
    // metaMask(),
    // injected({ target: "metaMask" })
  ],
  multiInjectedProviderDiscovery: true, 
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [liskSepolia.id]: http(),
  },
})