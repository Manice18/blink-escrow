"use client";

import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { shortenWalletAddress } from "@/lib/functions";

export default function WalletConnectButton() {
  const { publicKey, connecting, connected, disconnecting } = useWallet();

  return (
    <WalletMultiButton>
      <div className="flex flex-row items-center justify-normal space-x-4">
        {!publicKey ? (
          <>
            {!connecting && !connected && !disconnecting && (
              <Wallet className="size-6" />
            )}
            <p className="hidden whitespace-nowrap text-sm sm:block">
              Connect Wallet
            </p>
          </>
        ) : (
          <p className="hidden text-sm sm:block">
            {shortenWalletAddress(publicKey.toString())}
          </p>
        )}
      </div>
    </WalletMultiButton>
  );
}
