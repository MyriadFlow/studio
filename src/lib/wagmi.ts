import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
	chains: [
		// mainnet,

		baseSepolia,
	],
	connectors: [injected(), coinbaseWallet({ appName: 'Myriadflow' })],
	ssr: true,
	transports: {
		// [mainnet.id]: http(),
		[baseSepolia.id]: http(),
	},
})

declare module 'wagmi' {
	interface Register {
		config: typeof config
	}
}
