import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createStorage, cookieStorage } from 'wagmi'
import { base } from 'wagmi/chains'

// Get projectId from environment variables
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
  name: 'Myriadflow',
  description: 'Myriadflow',
  url: 'https://studio.myriadflow.com/', // Origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Define supported chains
const chains = [base] as const

// Create Wagmi configuration
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: true,
    socials: ['github', 'google', 'x', 'discord', 'apple'],
    showWallets: true, // Defaults to true
    walletFeatures: true
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})