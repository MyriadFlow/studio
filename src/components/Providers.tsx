"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import AppKitProvider from "@/lib/providers";

require("@solana/wallet-adapter-react-ui/styles.css");

export function ClientProviders({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: any;
}) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppKitProvider initialState={initialState}>
            {children}
          </AppKitProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
