"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";
import { useEscrow } from "@/hooks/useEscrow";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { shortenWalletAddress } from "@/lib/functions";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Check, Copy, ExternalLink } from "lucide-react";
import SolanaExplorer from "../SolanaExplorer";

interface EscrowAccount {
  publicKey: PublicKey;
  account: {
    seed: BN;
    maker: PublicKey;
    bump: number;
    mintA: PublicKey;
    mintB: PublicKey;
    receive: BN;
  };
}

const DisplayEscrows = () => {
  const { publicKey } = useWallet();
  const { refundEscrow, takerEscrow, getAllEscrowAccounts } = useEscrow();

  const [escrows, setEscrows] = useState<EscrowAccount[]>([]);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {},
  );

  const fetchEscrows = async () => {
    const fetchedEscrows = await getAllEscrowAccounts();
    setEscrows(fetchedEscrows);
  };

  useEffect(() => {
    fetchEscrows();
  }, []);

  async function handleRefundEscrow(escrow: PublicKey) {
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }
    try {
      await refundEscrow(escrow);
      toast.success("Escrow refunded successfully");
      await fetchEscrows();
    } catch (error) {
      console.error("Error refunding escrow:", error);
      toast.error("Failed to refund escrow");
    }
  }

  async function handleTakerEscrow(escrow: PublicKey) {
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }
    try {
      await takerEscrow(escrow);
      toast.success("Escrow taken successfully");
      await fetchEscrows();
    } catch (error) {
      console.error("Error taking escrow", error);
      toast.error("Failed to take escrow");
    }
  }

  const onCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    toast.message("Copied to clipboard");

    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 1000);
  };

  return escrows.length > 0 ? (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {escrows.map((value) => {
        const mintTakerKey = `mintTaker-${value.publicKey.toBase58()}`;
        const mintReceiverKey = `mintReceiver-${value.publicKey.toBase58()}`;
        return (
          <Card key={value.account.maker.toBase58()}>
            <CardHeader>
              <CardTitle>
                Escrow{" "}
                <span className="text-base font-normal text-muted-foreground">
                  (Maker: {shortenWalletAddress(value.account.maker.toBase58())}
                  )
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div>
                  <h2 className="mb-2 text-xl text-muted-foreground">
                    To Receive:
                  </h2>{" "}
                  <p className="px-2 text-4xl text-black dark:text-white">
                    {value.account.receive.toString()}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <h2 className="text-base text-muted-foreground">
                      Mint Taker:{" "}
                    </h2>
                    <span className="text-black dark:text-white">
                      {shortenWalletAddress(value.account.mintA.toBase58())}
                    </span>
                    <Button
                      onClick={() =>
                        onCopy(value.account.mintA.toBase58(), mintTakerKey)
                      }
                      disabled={copiedStates[mintTakerKey]}
                      className="ml-2 h-6 rounded-full"
                    >
                      {copiedStates[mintTakerKey] ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                    <SolanaExplorer address={value.account.mintA.toBase58()}>
                      <Button className="h-6 rounded-full">
                        <ExternalLink className="size-4" />
                      </Button>
                    </SolanaExplorer>
                  </div>
                  <div className="flex space-x-2">
                    <h2 className="text-base text-muted-foreground">
                      Mint Receiver:{" "}
                    </h2>
                    <span className="text-black dark:text-white">
                      {shortenWalletAddress(value.account.mintB.toBase58())}
                    </span>
                    <Button
                      onClick={() =>
                        onCopy(value.account.mintB.toBase58(), mintReceiverKey)
                      }
                      disabled={copiedStates[mintReceiverKey]}
                      className="ml-2 h-6 rounded-full"
                    >
                      {copiedStates[mintReceiverKey] ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                    <SolanaExplorer address={value.account.mintB.toBase58()}>
                      <Button className="h-6 rounded-full">
                        <ExternalLink className="size-4" />
                      </Button>
                    </SolanaExplorer>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                {publicKey?.toBase58() === value.account.maker.toBase58() && (
                  <div className="flex justify-between">
                    <Button
                      variant="destructive"
                      onClick={() => handleRefundEscrow(value.publicKey)}
                    >
                      Refund
                    </Button>
                    <Button>Share Blink</Button>
                  </div>
                )}
                {publicKey?.toBase58() !== value.account.maker.toBase58() && (
                  <Button
                    variant="default"
                    onClick={() => handleTakerEscrow(value.publicKey)}
                  >
                    Take
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  ) : (
    <div className="text-center">
      <h2 className="mx-auto">No Escrows to Display Yet</h2>
    </div>
  );
};

export default DisplayEscrows;
